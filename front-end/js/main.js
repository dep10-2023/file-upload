const btnSelectImage=$("#btn-select-image");
const fileChooser=$("#file-chooser");
const imageElm=$("#image");
const fileNameElm=$("#file-name");
const fileSizeElm=$("#file-size");
const btnUpload=$("#btn-upload");
const pbgElm=$("#pgb");
const progressElm=$("#progress");

btnUpload.attr('disabled','true');

btnSelectImage.on('click', ()=> fileChooser.trigger('click'));
fileChooser.on('change', ()=> setImagePreview());
btnUpload.on('click', ()=> uploadImage());



function uploadImage(){
   pbgElm.css('width','0%');
   progressElm.text('0%');
    const fileList=fileChooser[0].files;
    if (!fileList.length) return;


    const xhr=new XMLHttpRequest();
    const xhrUpload=xhr.upload;

    xhrUpload.addEventListener('progress',(eventData)=>{
        const uploadSize =eventData.loaded;
        const totalSize=eventData.total;
        const progress=(uploadSize/totalSize *100).toFixed(2)+"%";
        pbgElm.css('width',progress);
        progressElm.text(progress);
    })


    xhr.addEventListener('readystatechange',()=>{
        if (xhr.readyState===xhr.DONE){
            if (xhr.status==201){
                progressElm.text("Successfully Uploaded");
                pbgElm.css('width','100%');
            }else {
                progressElm.text("Failed to upload");
                pbgElm.css('width','5%');
            }
        }

    });

    xhr.open('POST','http://localhost:8080/gallery/uploads',true);
    // xhr.setRequestHeader("Content-Type","multipart/form-data");
    const formData=new FormData();
    formData.append('image',fileList[0]);
    xhr.send(formData);

}

function setImagePreview(){
    const fileList=fileChooser[0].files;
    if (!fileList.length) return;
    const imgFile=fileList[0];
    fileNameElm.text(imgFile.name);
    fileSizeElm.text(`${(imgFile.size/1024).toFixed(2) } KBs`);
    //btnUpload.removeAttr('disabled');

    const fileReader =new FileReader();
    fileReader.addEventListener('load',(eventData)=>{
        imageElm.css('background-image',`url(${fileReader.result}`);
        btnUpload.removeAttr('disabled');

    })
    fileReader.readAsDataURL(imgFile);
}

