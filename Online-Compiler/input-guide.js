/* Static hints only: never execute student source to discover prompts. */
(function(root){
  function inspect(source,language){
    const clean=source.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\*[\s\S]*?\*\/|\/\/[^\n]*|#[^\n]*/g, token=>{
      if(token.startsWith('"')||token.startsWith("'"))return token;
      if(token.startsWith('#')&&language!=='python')return token;
      return token.replace(/[^\n]/g,' ');
    });
    const prompts=[],reads=[];
    const decode=s=>s.replace(/\\n/g,' ').replace(/\\t/g,' ').replace(/\\"/g,'"').replace(/\\'/g,"'").replace(/\\\\/g,'\\').trim();
    const patterns={
      c:/\b(?:printf|puts)\s*\(\s*"((?:\\.|[^"\\])*)"/g,
      cpp:/\bcout\s*<<\s*"((?:\\.|[^"\\])*)"/g,
      python:/\binput\s*\(\s*["']((?:\\.|[^"'\\])*)["']/g,
      java:/\bSystem\.out\.print(?:ln)?\s*\(\s*"((?:\\.|[^"\\])*)"/g,
      javascript:/\bconsole\.log\s*\(\s*["']((?:\\.|[^"'\\])*)["']/g
    };
    for(const match of clean.matchAll(patterns[language]||/$^/g)){
      const value=decode(match[1]);
      if(value&&(language==='python'||/\b(enter|input|type|provide|choose)\b/i.test(value)))prompts.push(value);
    }
    if(language==='c')for(const match of clean.matchAll(/\bscanf\s*\(\s*"(?:\\.|[^"\\])*"\s*,([^;]*?)\)\s*;/g)){
      const variables=[...match[1].matchAll(/&?\s*([A-Za-z_]\w*(?:\[[^\]]+\])?)\s*(?:,|$)/g)].map(m=>m[1]);
      if(variables.length)reads.push(variables.join(', '));
    }
    return {prompts:prompts.slice(0,30),reads:reads.slice(0,30)};
  }
  root.CodeBhavyaInputGuide={inspect};
  if(typeof module!=='undefined')module.exports={inspect};
})(globalThis);
