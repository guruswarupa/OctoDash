import { FileList } from '../FileList';

export default function FileListExample() {
  const mockFiles = [
    { name: "benchy_0.2mm_PLA.gcode", size: "2.3 MB", date: "2 hours ago" },
    { name: "calibration_cube.gcode", size: "1.1 MB", date: "1 day ago" },
    { name: "phone_stand.gcode", size: "3.7 MB", date: "3 days ago" },
  ];

  return (
    <div className="p-4">
      <FileList
        files={mockFiles}
        onPrint={(filename) => console.log(`Print ${filename}`)}
        onDelete={(filename) => console.log(`Delete ${filename}`)}
        onUpload={() => console.log('Upload clicked')}
      />
    </div>
  );
}
