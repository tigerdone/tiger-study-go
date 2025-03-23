
let fileContainer;

function handleFileChange(e) {
  console.log('file', e);
  const [file] = e.target.files;
  if(!file) return;
  
  fileContainer = file;
  console.log('fileContainer', fileContainer);
}

console.log('handleFileChange', handleFileChange)

function createFileChunk(file, size) {

}

function handleSubmit(e) {
  if (!fileContainer) return;
  const fileChunkList = createFileChunk(fileContainer);


}
