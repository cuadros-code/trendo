const FileUploader = () => {
  return (
    <div className="flex items-center justify-center w-full h-24 bg-gray-200">
      <label className="flex items-center justify-center w-full h-full cursor-pointer">
        <input type="file" className="hidden" />
        <span className="text-sm font-semibold text-gray-500">
          Choose a file
        </span>
      </label>
    </div>
  );
}
 
export default FileUploader;