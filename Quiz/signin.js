(async()=>{
  const {client,$,esc}=CBQuiz;
  let mode="signin";
  const params=new URLSearchParams(location.search);
  const rawReturn=params.get("return")||"/Quiz/";
  const returnTo=(rawReturn.startsWith("/")&&!rawReturn.startsWith("//"))?rawReturn:"/Quiz/";

  const existing=await client.auth.getSession();
  if(existing.data?.session){ location.replace(returnTo); return; }

  function setMode(next){
    mode=next==="signup"?"signup":"signin";
    const signup=mode==="signup";
    $("nameField").hidden=!signup;
    $("displayName").required=signup;
    $("password").autocomplete=signup?"new-password":"current-password";
    $("authSubmit").textContent=signup?"Create account":"Sign in securely";
    $("signInTab").className=signup?"btn ghost":"btn primary";
    $("signUpTab").className=signup?"btn primary":"btn ghost";
    $("authMessage").innerHTML="";
  }
  $("signInTab").onclick=()=>setMode("signin");
  $("signUpTab").onclick=()=>setMode("signup");

  $("authForm").onsubmit=async(e)=>{
    e.preventDefault();
    const email=$("email").value.trim(), password=$("password").value, name=$("displayName").value.trim();
    $("authSubmit").disabled=true;
    $("authMessage").innerHTML='<div class="notice">Please wait…</div>';
    try{
      if(mode==="signup"){
        const result=await client.auth.signUp({email,password,options:{data:{display_name:name},emailRedirectTo:location.origin+"/Quiz/"}});
        if(result.error)throw result.error;
        if(result.data?.session){ location.replace(returnTo); return; }
        $("authMessage").innerHTML='<div class="notice">Account created. Confirm your email, then sign in.</div>';
      }else{
        const result=await client.auth.signInWithPassword({email,password});
        if(result.error)throw result.error;
        location.replace(returnTo);
      }
    }catch(err){$("authMessage").innerHTML=`<div class="notice bad">${esc(err.message||err)}</div>`}
    finally{$("authSubmit").disabled=false}
  };
})();
