import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

function DropZone({ addFile }) {
	const onDrop = useCallback(acceptedFiles => {
		addFile(acceptedFiles[0]);
	}, []);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	return (
		<div className="dropzone card" {...getRootProps()}>
			<input {...getInputProps()} />
			{isDragActive ? <p>i'll catch it...</p> : <p>Drop here..</p>}
		</div>
	);
}

export default DropZone;
