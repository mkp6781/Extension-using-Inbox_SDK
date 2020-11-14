var url;
msg = {
  txt: "jvh"
};

InboxSDK.load('2', 'sdk_extension-gmail_bd11839ecc').then(function(sdk){
    
    sdk.Conversations.registerFileAttachmentCardViewHandler(card => {
		card.addButton({
			iconUrl: "https://img.icons8.com/android/48/000000/upload.png",
			tooltip: 'Upload',
			async onClick(event){                
        url = await event.getDownloadURL();
        msg['downloadUrl'] = url,
        chrome.runtime.sendMessage(msg, function(response) {
          console.log(response)
        });			
      }
		});
	})
});

