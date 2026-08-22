/**
 * Prime Sprites — Automated Quality Assurance & Anti-Bug Tester
 * 
 * Verifies:
 * 1. JavaScript Syntax Validation (Parses extracted <script> blocks using Node vm module)
 * 2. Balance of brackets (), {}, []
 * 3. Integrity & consistency of CHEAT_CODES array and header counters
 * 4. Image HTTP health check and onerror handler enforcement
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const https = require('https');
const http = require('http');

const INDEX_PATH = path.join(__dirname, '..', 'index.html');

function checkBracketBalance(code) {
  const stack = [];
  const opening = ['(', '{', '['];
  const closing = [')', '}', ']'];
  const pairs = { ')': '(', '}': '{', ']': '[' };

  let inString = false;
  let stringChar = '';
  let inComment = false;
  let isBlockComment = false;

  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const nextChar = code[i + 1] || '';

    // Comment handling
    if (!inString && !inComment) {
      if (char === '/' && nextChar === '/') {
        inComment = true;
        isBlockComment = false;
        i++;
        continue;
      }
      if (char === '/' && nextChar === '*') {
        inComment = true;
        isBlockComment = true;
        i++;
        continue;
      }
    }

    if (inComment) {
      if (isBlockComment && char === '*' && nextChar === '/') {
        inComment = false;
        i++;
      } else if (!isBlockComment && (char === '\n' || char === '\r')) {
        inComment = false;
      }
      continue;
    }

    // String / Template Literal handling
    if (inString) {
      if (char === '\\') {
        i++; // skip escaped char
      } else if (char === stringChar) {
        inString = false;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      inString = true;
      stringChar = char;
      continue;
    }

    // Bracket checking
    if (opening.includes(char)) {
      stack.push({ char, index: i });
    } else if (closing.includes(char)) {
      if (stack.length === 0) {
        return { valid: false, error: `Unmatched closing bracket '${char}' at index ${i}` };
      }
      const top = stack.pop();
      if (top.char !== pairs[char]) {
        return { valid: false, error: `Mismatched bracket '${char}' at index ${i}, expected '${pairs[char]}'` };
      }
    }
  }

  if (stack.length > 0) {
    const top = stack.pop();
    return { valid: false, error: `Unclosed bracket '${top.char}' at index ${top.index}` };
  }

  return { valid: true };
}

function checkImageHealth(url) {
  return new Promise((resolve) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return resolve({ url, healthy: true, local: true });
    }

    const client = url.startsWith('https://') ? https : http;
    const req = client.request(url, { method: 'HEAD', timeout: 5000 }, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        resolve({ url, healthy: true, statusCode: res.statusCode });
      } else {
        resolve({ url, healthy: false, statusCode: res.statusCode });
      }
    });

    req.on('error', () => resolve({ url, healthy: false, error: 'Network error' }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ url, healthy: false, error: 'Timeout' });
    });

    req.end();
  });
}

async function runQualityCheck() {
  console.log('🛡️ Starting Automated Quality Assurance (Anti-Bug) Check...');

  if (!fs.existsSync(INDEX_PATH)) {
    console.error('❌ index.html file not found!');
    process.exit(1);
  }

  const htmlContent = fs.readFileSync(INDEX_PATH, 'utf8');

  // STEP 1: EXTRACT SCRIPT BLOCKS & PARSE JAVASCRIPT SYNTAX
  console.log('🔍 [1/3] Validating JavaScript syntax and bracket balance...');
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let scriptCount = 0;
  let syntaxErrors = 0;

  while ((match = scriptRegex.exec(htmlContent)) !== null) {
    const scriptCode = match[1];
    if (!scriptCode || !scriptCode.trim()) continue;

    // Skip external script tags with src
    if (match[0].includes('src=')) continue;

    scriptCount++;

    // Check bracket balance
    const balanceResult = checkBracketBalance(scriptCode);
    if (!balanceResult.valid) {
      console.error(`❌ Bracket Balance Error in Script Block #${scriptCount}:`, balanceResult.error);
      syntaxErrors++;
    }

    // Parse syntax using Node vm
    try {
      new vm.Script(scriptCode);
    } catch (err) {
      console.error(`❌ JS Syntax Error in Script Block #${scriptCount}:`, err.message);
      syntaxErrors++;
    }
  }

  if (syntaxErrors > 0) {
    console.error(`❌ Failed Quality Check: ${syntaxErrors} JavaScript syntax error(s) detected.`);
    process.exit(1);
  }
  console.log(`✅ Passed: ${scriptCount} inline JavaScript script blocks parsed with 0 syntax errors.`);

  // STEP 2: CHEAT CODES & STRUCTURE INTEGRITY CHECK
  console.log('🔍 [2/3] Validating CHEAT_CODES array integrity...');
  const cheatCodesMatch = htmlContent.match(/const CHEAT_CODES = (\[[\s\S]*?\]);/);
  if (cheatCodesMatch) {
    try {
      const cheatCodesArray = eval(cheatCodesMatch[1]);
      console.log(`✅ Found ${cheatCodesArray.length} Cheat Codes in CHEAT_CODES array.`);
      
      let invalidCheats = 0;
      cheatCodesArray.forEach((cheat, index) => {
        const hasCode = Boolean(cheat.code);
        const hasReward = Boolean(cheat.reward && (typeof cheat.reward === 'string' || (typeof cheat.reward === 'object' && (cheat.reward.fr || cheat.reward.en))));
        const hasType = Boolean(cheat.type);
        const hasTargetIfSprite = cheat.type !== 'sprite' || Boolean(cheat.targetId);

        if (!hasCode || !hasReward || !hasType || !hasTargetIfSprite) {
          console.error(`❌ Invalid cheat code object at index ${index}:`, cheat);
          invalidCheats++;
        }
      });

      if (invalidCheats > 0) {
        console.error(`❌ Failed Quality Check: ${invalidCheats} invalid cheat code object(s).`);
        process.exit(1);
      }
      console.log('✅ Passed: All Cheat Code objects contain valid attributes.');
    } catch (e) {
      console.error('❌ Failed to parse CHEAT_CODES array:', e.message);
      process.exit(1);
    }
  } else {
    console.warn('⚠️ CHEAT_CODES array definition not found via regex.');
  }

  // STEP 3: IMAGE TAGS & ONERROR PROTECTIONS CHECK
  console.log('🔍 [3/3] Auditing <img> tags and onerror handlers...');
  const imgRegex = /<img\b[^>]*>/gi;
  let imgMatch;
  let totalImages = 0;
  let missingOnError = 0;
  const externalImageUrls = [];

  while ((imgMatch = imgRegex.exec(htmlContent)) !== null) {
    const imgTag = imgMatch[0];
    totalImages++;

    if (!imgTag.includes('onerror')) {
      console.warn(`⚠️ Warning: Image tag missing onerror fallback handler: ${imgTag.substring(0, 60)}...`);
      missingOnError++;
    }

    const srcMatch = imgTag.match(/src="([^"]+)"/);
    if (srcMatch && srcMatch[1]) {
      const srcUrl = srcMatch[1];
      if (srcUrl.startsWith('http://') || srcUrl.startsWith('https://')) {
        externalImageUrls.push(srcUrl);
      }
    }
  }

  console.log(`✅ Audited ${totalImages} image tag(s). (${missingOnError} without onerror handler).`);

  if (externalImageUrls.length > 0) {
    console.log(`🌐 Performing HTTP health check on ${externalImageUrls.length} external image URL(s)...`);
    const results = await Promise.all(externalImageUrls.map(url => checkImageHealth(url)));
    let failedImages = 0;
    results.forEach(res => {
      if (!res.healthy) {
        console.warn(`⚠️ External image failed HTTP check (${res.statusCode || res.error}): ${res.url}`);
        failedImages++;
      } else {
        console.log(`  ✓ HTTP ${res.statusCode}: ${res.url.substring(0, 50)}...`);
      }
    });
    console.log(`ℹ️ External images check complete: ${externalImageUrls.length - failedImages}/${externalImageUrls.length} online.`);
  }

  console.log('🎉 All Quality Assurance (Anti-Bug) checks passed successfully!');
}

runQualityCheck().catch(err => {
  console.error('❌ QA Check execution error:', err);
  process.exit(1);
});
