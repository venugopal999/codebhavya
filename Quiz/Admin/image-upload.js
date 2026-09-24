(()=>{
  'use strict';
  const bucket='quiz-question-images';
  const formats={'image/png':'png','image/jpeg':'jpg','image/webp':'webp'};
  function bind({fileId,urlId,statusId,saveId,preview}){
    const {client,$,esc}=CBQuiz;
    const fileInput=$(fileId),urlInput=$(urlId),message=$(statusId),save=$(saveId);
    let uploading=false;
    fileInput.addEventListener('change',async()=>{
      const file=fileInput.files?.[0];if(!file)return;
      if(uploading)return;
      if(!formats[file.type]||file.size>5*1024*1024||file.size===0){
        message.innerHTML='<div class="notice bad">Choose a PNG, JPEG or WebP image up to 5 MB.</div>';
        fileInput.value='';return;
      }
      uploading=true;save.disabled=true;
      message.innerHTML='<div class="notice">Uploading image…</div>';
      try{
        const {data:userData,error:userError}=await client.auth.getUser();
        if(userError||!userData?.user?.id)throw new Error('Sign in again to upload an image.');
        const path=`${userData.user.id}/${crypto.randomUUID()}.${formats[file.type]}`;
        const {error}=await client.storage.from(bucket).upload(path,file,{
          cacheControl:'3600',contentType:file.type,upsert:false
        });
        if(error)throw error;
        const {data}=client.storage.from(bucket).getPublicUrl(path);
        if(!data?.publicUrl)throw new Error('Image uploaded but its URL could not be created.');
        urlInput.value=data.publicUrl;
        urlInput.dispatchEvent(new Event('change',{bubbles:true}));
        preview?.();
        message.innerHTML='<div class="notice">Image uploaded. Save the question to attach it.</div>';
      }catch(error){message.innerHTML=`<div class="notice bad">Upload failed: ${esc(error.message)}</div>`}
      finally{uploading=false;save.disabled=false;fileInput.value=''}
    });
    return {isUploading:()=>uploading};
  }
  window.CBQuizImageUpload={bind};
})();
