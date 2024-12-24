// const suma = (numero1, numero2) => {
//    if(!numero1 || !numero2) return 0
//    if(typeof numero1 !== 'number' || typeof numero2 !== 'number') return null
//    let result = numero1 + numero2
//    return result
// }

// const suma = (...numeros) => {

//     if(numeros.length === 0) return 0
   
   
//     let validInput = true
//     for (let i = 0; i < numeros.length && validInput; i++) {
//         if(typeof numeros[i] !== 'number'){
//             validInput = false
//         }
//     }

//     if(!validInput) return null

//     let result = 0
//     for (let i = 0; i < numeros.length; i++) {
//         result += numeros[i]        
//     }
//     return result
// }
// refactorizar 

const suma = (...numeros) => {
    if (numeros.length === 0) return 0
    if(!numeros.every(numero => typeof numero === 'number')) return null
    return numeros.reduce((sumaTotal, numero) => sumaTotal += numero, 0)

}


let testPasados = 0
let testTotales = 4

console.log('-------------------------------------------------------------')
console.log('Test 1: la fución debe devolver null si algún parámetro no es numérico')
let resultadoTest1 = suma('2',2)
if(resultadoTest1 === null) {
    console.log('test 1 paso')
    testPasados++
} else { 
    console.log(`Test 1 no paso, se recibió ${typeof resultadoTest1} pero se esperaba null`)
}

console.log('-------------------------------------------------------------')
console.log('Test 2: la fución debe devolver 0 si no se paso algún parámetro')
let resultadoTest2 = suma()
if(resultadoTest2 === 0) {
    console.log('test 2 paso')
    testPasados++
} else { 
    console.log(`Test 2 no paso, se recibió ${resultadoTest2} pero se esperaba 0`)
}

console.log('-------------------------------------------------------------')
console.log('Test 3: la fución debe devolver la suma correctamente.')
let resultadoTest3 = suma(5, 10)
if(resultadoTest3 === 15) {
    console.log('test 3 paso')
    testPasados++
} else { 
    console.log(`Test 3 no paso, se recibió ${resultadoTest3} pero se esperaba 15`)
}

console.log('-------------------------------------------------------------')
console.log('Test 4: la fución debe realizar la suma con cualquier cantidad de parámetros.')
let resultadoTest4 = suma(1,2,3,4,5)
if(resultadoTest4 === 15) {
    console.log('test 4 paso')
    testPasados++
} else { 
    console.log(`Test 4 no paso, se recibió ${resultadoTest4} pero se esperaba 15`)
}

if(testPasados === testTotales) console.log('todo los test pasaron')
else console.log(`Ha pasado ${testPasados} test de ${testTotales}.`)