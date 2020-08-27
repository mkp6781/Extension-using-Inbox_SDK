var url;
msg = {
  txt: "jvh"
};

InboxSDK.load('2', 'sdk_extension-gmail_bd11839ecc').then(function(sdk){
    
    sdk.Conversations.registerFileAttachmentCardViewHandler(card => {
		card.addButton({
			iconUrl: chrome.runtime.getURL('zipicon.png'),
			tooltip: 'Upload',
			async onClick(event){                
        url = await event.getDownloadURL();
        msg['downloadUrl'] = url,
        console.log("download url" , url)
        chrome.runtime.sendMessage(msg, function(response) {
          console.log(response)
        });			
      }
		});
	})
});


// APP_ID = sdk_extension-gmail_bd11839ecc