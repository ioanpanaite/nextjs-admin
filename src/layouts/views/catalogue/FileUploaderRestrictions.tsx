// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { addCatalogue } from 'src/store/apps/catalogue'

interface FileProp {
  name: string
  type: string
  size: number
}

interface CsvFileProps {
  [key: string]: string
}

const FileUploaderRestrictions = () => {
  // ** State
  const [files, setFiles] = useState<File[]>([])

  const fileReaderFirst = new FileReader();
  const fileReaderSecond = new FileReader();

  const dispatch = useDispatch<AppDispatch>()

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 2,
    maxSize: 100000000,
    accept: {
      'text/csv': ['.csv']
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    },
    onDropRejected: () => {
      toast.error('You can only upload 2 csv files in a time.', {
        duration: 2000
      })
    }
  })

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <Icon icon='tabler:file-description' />
    }
  }

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
    setFiles([...filtered])
  }

  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <Icon icon='tabler:x' fontSize={20} />
      </IconButton>
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  const csvFileToArray = (item: string) => {
    const csvHeader = item.slice(0, item.indexOf("\n")).split(",");
    const csvRows = item.slice(item.indexOf("\n") + 1).split("\n");

    const csvFileData = csvRows.map(i => {
      const values = i.split(",");
      const obj = csvHeader.reduce<CsvFileProps>((object, header, index) => {
        const trimHeader = header.trim()
        object[trimHeader] = values[index];

        return object;
      }, {});

      return obj;
    });

    try {
      const add = async () => {
        const result = await dispatch(addCatalogue(csvFileData)).unwrap()
        if (result.ok) {
          handleRemoveAllFiles();
        }
      }
      add();
    } catch (e) {
      console.log(e)
    }

  };

  const handleUploadFile = () => {
    if (files.length >= 1) {
      fileReaderFirst.onload = function (event) {
        const csvOutput = event?.target?.result as string;
        csvFileToArray(csvOutput)
      };
      fileReaderFirst.readAsText(files[0]);

      if (files.length === 2) {
        fileReaderSecond.onload = function (event) {
          const csvOutput = event?.target?.result as string;
          csvFileToArray(csvOutput)
        };
        fileReaderSecond.readAsText(files[1]);
      }
    }
  }

  return (
    <Fragment>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Box
            sx={{
              mb: 8.75,
              width: 48,
              height: 48,
              display: 'flex',
              borderRadius: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
            }}
          >
            <Icon icon='tabler:upload' fontSize='1.75rem' />
          </Box>
          <Typography variant='h4' sx={{ mb: 2.5 }}>
            Drop files here or click to upload.
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Allowed *.csv</Typography>
          <Typography sx={{ color: 'text.secondary' }}>Max 2 files and max size of 2 MB</Typography>
        </Box>
      </div>
      {files.length ? (
        <Fragment>
          <List>{fileList}</List>
          <div className='buttons'>
            <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
              Remove All
            </Button>
            <Button variant='contained' onClick={handleUploadFile}>Upload Files</Button>
          </div>
        </Fragment>
      ) : null}
    </Fragment>
  )
}

export default FileUploaderRestrictions
