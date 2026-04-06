const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

const HTML_FILES = [
  'index.html',
  'case-study-meta.html',
  'case-study-metaverse.html',
];

function readHTML(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf-8');
}

function fileExists(filePath) {
  // Strip query strings and anchors
  const clean = filePath.split('?')[0].split('#')[0];
  return fs.existsSync(path.join(ROOT, decodeURIComponent(clean)));
}

// Extract asset references from HTML (excluding inline scripts)
function extractAssets(html) {
  // Strip <script> blocks so we don't pick up JS string concatenation
  const stripped = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  const assets = [];
  const regex = /(?:src|href)="([^"]+)"/g;
  let match;
  while ((match = regex.exec(stripped)) !== null) {
    const ref = match[1];
    if (
      ref &&
      !ref.startsWith('http') &&
      !ref.startsWith('//') &&
      !ref.startsWith('mailto:') &&
      !ref.startsWith('#') &&
      !ref.startsWith('data:')
    ) {
      assets.push(ref);
    }
  }
  return assets;
}

// ---- Tests ----

describe('HTML files exist and are non-empty', () => {
  for (const file of HTML_FILES) {
    it(file, () => {
      const fullPath = path.join(ROOT, file);
      assert.ok(fs.existsSync(fullPath), `${file} should exist`);
      const content = fs.readFileSync(fullPath, 'utf-8');
      assert.ok(content.length > 0, `${file} should not be empty`);
    });
  }
});

describe('All referenced assets exist', () => {
  for (const file of HTML_FILES) {
    describe(file, () => {
      const html = readHTML(file);
      const assets = extractAssets(html);
      for (const asset of assets) {
        it(`asset: ${asset}`, () => {
          assert.ok(fileExists(asset), `Missing asset: ${asset}`);
        });
      }
    });
  }
});

describe('No TODO comments in production HTML', () => {
  for (const file of HTML_FILES) {
    it(file, () => {
      const html = readHTML(file);
      const todos = html.match(/TODO/gi) || [];
      assert.strictEqual(todos.length, 0, `${file} contains ${todos.length} TODO comment(s)`);
    });
  }
});

describe('Meta tags present', () => {
  for (const file of HTML_FILES) {
    it(`${file} has meta description`, () => {
      const html = readHTML(file);
      assert.ok(
        html.includes('meta name="description"'),
        `${file} is missing a meta description`
      );
    });

    it(`${file} has charset`, () => {
      const html = readHTML(file);
      assert.ok(
        html.includes('meta charset'),
        `${file} is missing charset declaration`
      );
    });

    it(`${file} has viewport`, () => {
      const html = readHTML(file);
      assert.ok(
        html.includes('meta name="viewport"'),
        `${file} is missing viewport meta tag`
      );
    });
  }
});

describe('Favicon exists', () => {
  it('favicon.ico is present', () => {
    assert.ok(
      fs.existsSync(path.join(ROOT, 'favicon.ico')),
      'favicon.ico should exist in project root'
    );
  });
});

describe('CSS and JS files exist', () => {
  it('css/style.css', () => {
    assert.ok(fileExists('css/style.css'));
  });

  it('css/case-study.css', () => {
    assert.ok(fileExists('css/case-study.css'));
  });

  it('js/main.js', () => {
    assert.ok(fileExists('js/main.js'));
  });
});

describe('Key content — Landing page', () => {
  const html = readHTML('index.html');

  it('has hero headline', () => {
    assert.ok(html.includes('express and connect'), 'Missing hero headline');
  });

  it('has work section', () => {
    assert.ok(html.includes('id="work"'), 'Missing work section');
  });

  it('has about section', () => {
    assert.ok(html.includes('id="about"'), 'Missing about section');
  });

  it('has footer', () => {
    assert.ok(html.includes('id="footer"'), 'Missing footer');
  });

  it('has all project cards', () => {
    assert.ok(html.includes('Bridge to Metaverse'), 'Missing Metaverse card');
    assert.ok(html.includes('Creator Recommendations'), 'Missing CM card');
    assert.ok(html.includes('Superapp'), 'Missing Grab card');
    assert.ok(html.includes('Cashtree'), 'Missing Cashtree card');
    assert.ok(html.includes('VOLO'), 'Missing VOLO card');
  });

  it('has particle sphere canvas', () => {
    assert.ok(html.includes('hero-canvas'), 'Missing hero canvas');
  });
});

describe('Key content — Creator Marketplace case study', () => {
  const html = readHTML('case-study-meta.html');

  it('has hero title', () => {
    assert.ok(html.includes('AI-Powered Creator Recommendations'));
  });

  it('has all sections', () => {
    assert.ok(html.includes('Challenge'), 'Missing Challenge');
    assert.ok(html.includes('Strategy'), 'Missing Strategy');
    assert.ok(html.includes('Process'), 'Missing Process');
    assert.ok(html.includes('Solution'), 'Missing Solution');
    assert.ok(html.includes('Impact'), 'Missing Impact');
    assert.ok(html.includes('Reflections'), 'Missing Reflections');
  });

  it('has key results', () => {
    assert.ok(html.includes('+30%'), 'Missing +30% metric');
    assert.ok(html.includes('+25%'), 'Missing +25% metric');
    assert.ok(html.includes('+20%'), 'Missing +20% metric');
  });
});

describe('Key content — Metaverse case study', () => {
  const html = readHTML('case-study-metaverse.html');

  it('has hero title', () => {
    assert.ok(html.includes('Bridge to Metaverse Vision'));
  });

  it('has all sections', () => {
    assert.ok(html.includes('Challenge'), 'Missing Challenge');
    assert.ok(html.includes('Strategy'), 'Missing Strategy');
    assert.ok(html.includes('Process'), 'Missing Process');
    assert.ok(html.includes('Exploration'), 'Missing Exploration');
    assert.ok(html.includes('Solution'), 'Missing Solution');
    assert.ok(html.includes('Impact'), 'Missing Impact');
    assert.ok(html.includes('Reflections'), 'Missing Reflections');
  });

  it('has key results', () => {
    assert.ok(html.includes('Prioritized into Roadmap'), 'Missing Pets metric');
    assert.ok(html.includes('Engineering Headcount Secured'), 'Missing headcount metric');
    assert.ok(html.includes('Cross-Org Leadership Buy-in'), 'Missing buy-in metric');
  });

  it('has reflection titles', () => {
    assert.ok(html.includes('Start Light, Think Bold'));
    assert.ok(html.includes('Behavior First, Technology Second'));
    assert.ok(html.includes('Align Orgs Through Shared Artifacts'));
  });
});

describe('Footer consistency', () => {
  for (const file of HTML_FILES) {
    it(`${file} has correct footer closing`, () => {
      const html = readHTML(file);
      assert.ok(
        html.includes('Thanks for stopping by :)'),
        `${file} has wrong footer closing text`
      );
    });
  }
});

describe('No broken internal page links', () => {
  for (const file of HTML_FILES) {
    it(file, () => {
      const html = readHTML(file);
      const linkRegex = /href="([^"]+\.html)"/g;
      let match;
      while ((match = linkRegex.exec(html)) !== null) {
        const linked = match[1].split('?')[0].split('#')[0];
        assert.ok(
          fs.existsSync(path.join(ROOT, linked)),
          `Broken link in ${file}: ${linked}`
        );
      }
    });
  }
});
