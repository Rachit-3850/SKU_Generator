import React, { useEffect, useRef } from 'react';
import {message} from 'antd'


const CSVDownloadLink = ({ data, fileName , successMessage , downloadFlagRef  , upload , setUpload} : any) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  // const successMessage = () => {
	// 	api.open({
	// 		type: "success",
	// 		content: "SKUs are generated. Please check the downloaded file",
	// 		duration: 10
	// 	});
	// };

  // const downloadFlagRef = useRef(false);
  useEffect(() => {
    if (linkRef.current && data  && !downloadFlagRef.current) {
      // let csvContent = '';
      // data.forEach((rowArray : any) => {
      //   let row = rowArray.join(','); // Convert the row array to a comma-separated string
      //   csvContent += row + '\r\n'; // Append the row to the CSV content with a line break
      // });
    
    
      const blob = new Blob([data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
    
      linkRef.current.href = url;
      linkRef.current.setAttribute('download', fileName);
      // linkRef.current.setAttribute('image', "images/favicon.ico");
      
      linkRef.current.click();
      successMessage()
      downloadFlagRef.current = true;
      setUpload(true)
      // setTimeout( function() {
      //   window.location.reload();
      // }, 6000);
      // Cleanup
      return () => {
        URL.revokeObjectURL(url);
      };
      
    }
  }, [downloadFlagRef , upload]);



  return (
    <>
    <a ref={linkRef} style={{ display: 'none' }} />
    {/* {downloadFlagRef ? successMessage : ("")} */}
    </>
  );
};

export default CSVDownloadLink;
