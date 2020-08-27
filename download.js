var isButtonClicked = 0;
var ispdf = 0;
var downloadDone = 0;
var opened = 0;
var load = 1;
var resumeFile;
var urlprime;
var activeTabId;

chrome.browserAction.onClicked.addListener(buttonClicked);
    function buttonClicked(tab) {
        let msg = {
            txt: "hello"
            }
    chrome.tabs.sendMessage(tab.id, msg);
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("hey");
        if (request.txt==="jvh")
            chrome.tabs.create({url:request.downloadUrl});
            isButtonClicked = 1;
            return true;
});


chrome.downloads.onCreated.addListener(
    function(downloadItem) {         
        if(isButtonClicked == 1){
            console.log(downloadItem.mime ,downloadItem.filename);
            if(downloadItem.mime === "application/pdf"){
                ispdf = 1;
            }
            else{
                alert("File is not in pdf format. Please convert to pdf.");
            }
        }
});


chrome.downloads.onChanged.addListener(
    function(downloadItema){
        if(ispdf==1){
            if (downloadItema.state["current"] === "complete"){
                console.log("download complete");
                chrome.downloads.open(downloadItema.id);
                downloadDone = 1; 
            }
        }
});

chrome.tabs.onCreated.addListener(
        function(newTab){
            resumeFile = newTab.pendingUrl;
            if(downloadDone==1 && isButtonClicked==1 && ispdf==1){
                uploadFile(resumeFile);
            }
});

function uploadFile(resumeFile){
    const urlprime = "http://upload.primeideas.live/upload/";
    var xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.open("GET", resumeFile , true);
    xhr.send();
    xhr.onload = function(){
        console.log(`Loaded: ${xhr.status} ${xhr.response}`);
        var formData = new FormData();
        console.log(`Length: ${xhr.response.length}, ${xhr.response}`);
        formData.append("file" , xhr.response , "resume.pdf");
        fetch(urlprime , {
            method:"POST",
            body: formData
        })
            .then(response=>{
            if (response){
                alert(response.data);
            }else{
                alert("Upload unsuccesful");
            }
        })    
    };
    
    xhr.onerror = function() { // only triggers if the request couldn't be made at all
        console.log(`Network Error`);
    };
    
    xhr.onprogress = function(event) { // triggers periodically
        // event.loaded - how many bytes downloaded
        // event.lengthComputable = true if the server sent Content-Length header
        // event.total - total number of bytes (if lengthComputable)
        console.log(`Received ${event.loaded} of ${event.total}`);
    }; 
}



