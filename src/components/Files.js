import React, { useState ,useEffect } from 'react'
import { useContext } from 'react';
import fileContext from '../context/filecontext';
import { useNavigate } from 'react-router-dom';
import io from "socket.io-client";

function Files(props) {
  
  const socket = io.connect("http://localhost:3001");

  const navigate = useNavigate();
  const context = useContext(fileContext);

  let {getfolders ,naming ,parent ,settitle ,userdet} = context;
  const [name, setname] = useState(props.element.name)
  const [change, setchange] = useState(true)
  const [user, setuser] = useState('hehe')
  const [link, setlink] = useState('huhu')

  const dbl = () => {
    setchange(false)
  }

  document.addEventListener('keydown', function(event) {
    if (event.code === 'Enter') {
      setchange(true)
      naming(props.element._id ,name)
    }
  });

  socket.emit("send_person", user);
  socket.emit("send_link", { link, user });

  socket.on("receive_link", (data) => {
    console.log(data.link);
  });

  const onChange = (e)=>{
    setname(e.target.value)
  }


  const det = async () => {
    let data = await userdet();
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      det();
    } else {
      navigate('/login')
    }
  }, [])
  
  
  return (
    <>
        <div className='file container'>
            <div className='d-flex my-5' style={{flexDirection:`column`}}>
              {!name.includes('pdf') &&  <div onClick={()=>{getfolders(props.element._id);parent = props.element._id}}><i className="fa-solid fa-folder" style={{color: `#f0d314`,fontSize:`5em`}}></i></div>}
              {name.includes('pdf') &&  <div onClick={() => {settitle(name);navigate('/view')}}><i className="fa-solid fa-file-lines" style={{color: '#d62424' ,fontSize:`4em`,marginTop:'0.2em'}}></i></div>}
              {change && <div onDoubleClick={dbl} className='name' style={{marginTop:`2px`}}>{name}</div>}
              {!change && <div><input type="text" className="name" value={name} onChange={onChange}/></div>}
            </div>
        </div>
    </>
  )
}

export default Files