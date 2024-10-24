

import React, { useState,useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AddContractTemplate, FetchTemplates } from '../../api/services';
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Textarea,
  Select,
  Option,
} from "@material-tailwind/react";
import { useFormik } from 'formik';
import * as yup from "yup";
import { toast } from 'react-toastify';
import TableForAll from '../../Components/Admin/Tables/TableForAll';

const ContractsTemplates = () => {
  const [templates,setTemplates] = useState([])
    const token = useSelector(state=>state.AdminReducer.accessToken)
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false)

  const handleOpen = () => setOpen((cur) => !cur);

    
    
     useEffect(() => {
      try {
        const fetchContractTemplates = async () => {
          const response = await FetchTemplates(token);
          console.log(response);
          if (response) {
            setTemplates(response?.payload)
          }
        };
        fetchContractTemplates();
      } catch (error) {
        console.log(error);
      }

    }, [refresh,token])

    const onSubmit = async () => {
      try {
        console.log(values);
        const response = await AddContractTemplate(values, token);
  
        console.log(response);
        if (response) {
          toast.success("Template added !!");
          setRefresh(!refresh)
          handleOpen();
        }
      } catch (error) {
        console.log(error);
        handleOpen()
        toast.error("Couldn't add template!!");
      }
    };

    const {
      values,
      errors,
      touched,
      handleBlur,
      handleChange,
      handleSubmit,
      setFieldValue,
    } = useFormik({
      initialValues: {
        template_name:"",
        template_id:"",
        listing_type:"",
      
      },
      validationSchema: yup.object().shape({
        template_name: yup
        .string()
        .required('Template name is required'),
      
      template_id: yup
        .string()
        .required('Template ID is required'),
    
      listing_type: yup
        .string()
        .oneOf(['buy', 'rent', 'lease'], 'Listing type must be either "buy", "rent", or "lease"')
        .required('Listing type is required')
      }),
      onSubmit,
    });
     const columns = [
    { header: 'Template Name', accessor: 'template_name' },
    { header: 'DocuSign Id', accessor: 'template_id' },
    { header: 'Type', accessor: 'listing_type' },
    {
      header: 'Status',
      accessor: 'is_active',
      cell: (row) => (
        <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${row.is_active ? 'bg-success text-success' : 'bg-warning text-warning'}`}>
          {row.is_active ? 'active' : 'disabled'}
        </p>
      )
    }
  ];
  return (
    <>
        <>
        <Dialog
          size="xs"
          open={open}
          handler={handleOpen}
          className="bg-transparent shadow-none"
        >
          <Card className="mx-auto w-full max-w-[24rem]">
            <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
                Add a Template
              </Typography>
              
              
              <Input
                label="Template Name"
                size="lg"
                name="template_name"
                value={values.template_name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.template_name && errors.template_name
                    ? errors.template_name
                    : null
                }
              />
               
              <Input
                label="Template Id"
                size="lg"
                name="template_id"
                value={values.template_id}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.template_id && errors.template_id
                    ? errors.template_id
                    : null
                }
              />
              
      <Select
        label="Select Listing Type"
        size="lg"
        name="listing_type"
        value={values.listing_type}
        onChange={(e) => setFieldValue("listing_type", e)}
        onBlur={handleBlur}
        error={
          touched.listing_type && errors.listing_type
            ? errors.listing_type
            : null
        }
      >
        <Option value="buy">Buy</Option>
        <Option value="rent">Rent</Option>
        <Option value="lease">Lease</Option>
      </Select>
            </CardBody>
            <CardFooter className="pt-0 flex justify-between px-5">
              
              <Button color="#1d4ed8" variant="gradient" onClick={handleSubmit} fullWidth>
                Add
              </Button>
            </CardFooter>
          </Card>
        </Dialog>
      </>

      <div className="mt-4    ">
        <p
        onClick={()=>handleOpen(true)}
         className='mb-4 flex justify-end me-2 w-fit p-2 text-white cursor-pointer bg-primary-600 hover:bg-primary-500'>
          New Template
          </p>
        <div className="col-span-12 xl:col-span-8">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
      {templates?.length > 0 ? (
                <TableForAll
                  columns={columns}
                  data={templates}
                />
              ) : (
                <p className='text-center text-title-md'>No Templates!!</p>
              )}
       
      </div>
    </div>
        </div>
       
      </div>
    </>
  )
}

export default ContractsTemplates

