// import React, {useState, useEffect} from "react";
// // const Home = ({setUser}) =>{
// //     console.log(setUser);
// //     return(
// //         <div className="home">
// //             <h1>selam</h1>
// //         </div>
// //     )
// // }

// const Home = () => {
//     return (
//         <>
//             <h1>Home Page</h1>
//         </>
//     )
// };

// export default Home;

import React, {useState, useEffect, Component} from "react";
const Home = ({setUser}) =>{
    const user = setUser;
    const [loaded, setLoaded] = useState(false);
    const [selectedImage, setSelectesImage] = useState("");
    const fileInput = document.getElementById('fileInput');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const {name, value} = e.target;
        // setFormData({ ...formData, [name]:value});
    };
    const [reader, setReader] = useState<{reader: any}>();
    const handleImageChange = async (e) =>{
        var formData = new FormData()
        formData.append('file', file)
        var file = e.target.files[0];
        console.log("MYFile: "+ file.buffer);
        file = {...file, musab: "Musab"}
        file = {...file, nosamanz: "OOzcan"}
        try {
            await fetch('http://10.12.14.1:80', {
                method: 'POST',
                headers: {
                    // 'Content-Type': 'application/json'
                    // 'authorization': 'Bearer ' + token
                },
                body: formData,
            })
        }
        catch(error)
        {console.log("Fetch Errorrrrrrr")}
        // const reader = new FileReader();
        // reader.readAsDataURL(file);
        // setReader({reader: reader});
        // console.log("filto: ", e.target.files[0])
        // if (file){
        //     setSelectesImage(URL.createObjectURL(file));
        //     // console.log("I'm here");
        //     // formData.append('file', file);
        // }
        // else
        // {
        //     setSelectesImage("");
        // }
    }
    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault();
        try{
            // const response = await fetch('http://10.12.13.2:80/user/getForm', {
            //  method: 'POST',
            //  headers: {
            //      'Content-Type': 'application/json',
            //  },
            //  body: JSON.stringify(formData),
            // });
            // console.log(": " +formData.image);
            const formData = new FormData();
            console.log("File--- "+ reader?.reader.result)
            formData.append('file', reader?.reader.result);
            const responseImage = await fetch('http://10.12.13.2:80/avatar/upload', {
                method: 'POST',
                headers: {
                    'authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjk4OTU5LCJpYXQiOjEzMzM0MTUwODc2fQ.nQc9al-VV2z-w9oYNrG7_6KgMqQUcfy3yqqLq9fdR28',
                },
                body: formData,
            });
            if (responseImage.ok){
                console.log('Image submitted successfully');
            }
            else{
                console.error('Image submission failed');
            }
            // if (response.ok){
            //  console.log('Form submitted successfully');
            // }
            // else{
            //  console.error('Form submission failed');
            // }
        }catch(error){
            console.error('An error occurred:', error);
        }
    };
    useEffect(() =>{
    })
    const handleClick = (event) =>{
        setLoaded(true);
        event.preventDefault();
    }
    return(
        <div className="home">
        {
            loaded ? (
                <div className="containerHome">
                </div>
            )
            :
            (
                <div className="form">
                <div className="formHeader">
                  <h2 className="homeForm">Nickname ve Resim Seçin</h2>
                </div>
                <div className="formBody">
                    <form>
                        <div className="formDiv">
                            <label>Nickname: </label>
                        <input type="text" name="name" placeholder={user} onChange={handleChange} className="formInput"></input>
                        </div><div className="formDiv">
                            <label></label>
                        <input id = "fileInput" type="file" name="image" accept="images/*" onChange={handleImageChange}/>
                        </div>
                        <div>
                        <h3>Seçilen Resim</h3>
                        <img src= {selectedImage} alt="" className="formImage"></img>
                        </div>
                        <button type="submit" onClick={handleSubmit}>Gönder</button>
                    </form>
                </div>
            </div>
            )
        }
        </div>
    )
}
export default Home;
