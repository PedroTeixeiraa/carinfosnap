import React, { useState } from 'react'
import run from "./gemini"
import { FaCar } from "react-icons/fa";
import Loader from "react-js-loader";
import Icone from './assets/carinfosnap-high-resolution-logo-black.svg';
import "./App.css"

function ImageComponent({ file, width, height }) {
  const imageUrl = URL.createObjectURL(file)

  return (
    <img src={imageUrl} width={width} height={height} alt="Descrição da Imagem" />
  )
}

function CarTable({ carros }) {
  return (
    <div>
      <header className='carros-cabecalho'>
        <span>Imagem</span>
        <span>Modelo</span>
        <span>Marca</span>
        <span>Cor</span>
        <span>Placa</span>
      </header>
      <main className='carros-conteudo'>
        {carros.map((carro) => (
          <content key={carro.placa}>
            <span><ImageComponent file={carro.imagem} width={100} height={60} /></span>
            <span>{carro.nome}</span>
            <span>{carro.marca}</span>
            <span>{carro.cor}</span>
            <span>{carro.placa}</span>
          </content>
        ))}
      </main>
    </div>
  )
}   

function App() {
  const [imagemPreview, setImagemPreview] = useState()
  const [carrosProcessados, setCarrosProcessados] = useState([])

  const selectMedia = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = handleMediaUpload
    input.click()
  }

  const handleMediaUpload = async (event) => {
    const file = event.target.files[0]
    
    try {
      setImagemPreview(file)
      const response = await run(file)
      setCarrosProcessados([{
        ...response,
        imagem: file
      }, ...carrosProcessados])
      setImagemPreview(null)
    } catch (error) {
      console.error('Error fetching media info:', error)
    }
  }

  return (
    <div className="container">
      <img className="logo" src={Icone} width={300} height={150} alt='icone'/>
      <div className="content">
        <div className='imagem'>
          <div className='imagem-botao'>
            <button className="media-botao" onClick={selectMedia}>
              <p>Selecionar imagem</p>
              <FaCar size={128}/>
            </button>
          </div>
            {imagemPreview && (
              <div className='imagem-preview'>
                <Loader type="spinner-circle" bgColor={"#0074d9"} color={"#0074d9"} title={"Processando imagem..."} size={100} />
              </div>
            )}
        </div>
        <div className='carros'>
          <p className='carros-texto'>Imagens processadas</p>
          {carrosProcessados.length > 0 && (
            <CarTable carros={carrosProcessados} />
          )}
        </div>
      </div>
    </div>
  )
}

export default App