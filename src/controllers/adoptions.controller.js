const { adoptionsService, petsService, usersService } = require("../services/index.js") 

const getAllAdoptions = async (req, res) => {
    const result = await adoptionsService.getAll()
        .populate('owner', 'first_name last_name') // Obtiene el nombre y apellido del usuario
        .populate('pet', 'name specie'); // Obtiene el nombre y especie de la mascota
    
    res.send({ status: "success", payload: result });
};

const getAdoption = async (req, res) => {
    const adoptionId = req.params.aid;
    const adoption = await adoptionsService.getBy({ _id: adoptionId })
        .populate('owner', 'first_name last_name') // Obtiene el nombre y apellido del usuario
        .populate('pet', 'name specie'); // Obtiene el nombre y especie de la mascota

    if (!adoption) return res.status(404).send({ status: "error", error: "Adoption not found" });
    
    res.status(200).send({ status: "success", payload: adoption });
};


const createAdoption = async(req,res)=>{
    const {uid,pid} = req.params;
    const user = await usersService.getUserById(uid);
    if(!user) return res.status(404).send({status:"error", error:"user Not found"});
    const pet = await petsService.getBy({_id:pid});
    if(!pet) return res.status(404).send({status:"error",error:"Pet not found"});
    if(pet.adopted) return res.status(400).send({status:"error",error:"Pet is already adopted"});
    user.pets.push(pet._id);
    await usersService.update(user._id,{pets:user.pets})
    await petsService.update(pet._id,{adopted:true,owner:user._id})
    const result = await adoptionsService.create({owner:user._id,pet:pet._id})
    res.send({status:"success", payload: result, message:"Pet adopted"})
}

// Eliminar adopción
const deleteAdoption = async (req, res) => {
    const adoptionId = req.params.aid;

    try {
        const adoption = await adoptionsService.delete(adoptionId);  // Utiliza el método delete heredado
        if (!adoption) return res.status(404).send({ status: "error", error: "Adoption not found" });

        res.status(200).send({ status: "success", message: "Adoption deleted" });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
};

module.exports = {
    createAdoption,
    getAllAdoptions,
    getAdoption,
    deleteAdoption
}