const Cliente = require('../models/Cliente')
const Drone = require('../models/Drone')

const CryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const cadastrar = async (req, res) => {
    const valores = req.body

    if (!valores.modelo || !valores.marca || !valores.numeroSerie || !valores.tipoServico || !valores.idCliente) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' })
    }

    try {

        const numeroSerieCriptografado = CryptoJS.AES.encrypt(valores.numeroSerie, CHAVE_SECRETA).toString()

        await Drone.create({
            modelo: valores.modelo,
            marca: valores.marca,
            numeroSerie: numeroSerieCriptografado,
            tipoServico: valores.tipoServico,
            idCliente: valores.idCliente
        })

        const cliente = await Cliente.findByPk(valores.idCliente)
        if(!cliente){
            return res.status(404).json({message: 'Cliente não encontrado!'})
        }

        return res.status(201).json({ message: 'Drone cadastrado com sucesso!', drone: novoDrone })
    } catch (err) {
        console.error('Erro ao cadastrar drone:', err)
        return res.status(500).json({ message: 'Erro ao cadastrar drone!' })
    }
}

const listar = async (req, res) => {
    try {
        const drones = await Drone.findAll()
        let resultado = []

        drones.forEach((el)=>{
            let numeroSerieDescriptografado = ''
            try{
                const bytes = CryptoJS.AES.decrypt(el.cpf, CHAVE_SECRETA)
                numeroSerieDescriptografado = bytes.toString(CryptoJS.enc.Utf8)
            }catch(err){
                numeroSerieDescriptografado = 'Erro ao descriptografar'
                console.error(numeroSerieDescriptografado, err)
            }
            resultado.push({
                modelo: valores.modelo,
                marca: valores.marca,
                numeroSerie: numeroSerieDescriptografado,
                tipoServico: valores.tipoServico,
                idCliente: valores.idCliente
            })
        })

        return res.status(200).json(resultado)
    } catch (err) {
        console.error('Erro ao listar drones!', err)
        return res.status(500).json({ message: 'Erro ao listar drones!' })
    }
}

module.exports = {cadastrar, listar}