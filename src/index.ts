import express, {Request, Response} from 'express';
import 'dotenv/config'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const port = process.env.PORT || 7777

app.listen(port, () => {
	console.log(`Server up on PORT ${port}`)
});

//========================================================


let AllUsers:User[] = [
    {
      "id": 0,
      "name": "Marcio",
      "cpf": "9211573.741-30",
      "email": "aqui@mesmo.org",
      "age": 22,
      "transaction": [
        {
          "id": 0,
          "title": "TTT",
          "value": 100,
          "type": "income"
        },
        {
          "id": 1,
          "title": "WWW",
          "value": 50,
          "type": "outcome"
        }
      ]
    },
    {
      "id": 1,
      "name": "Paulo",
      "cpf": "9214573.741-30",
      "email": "aqui@mesmo.org",
      "age": 33,
      "transaction": [
        {
          "id": 2,
          "title": "aaa",
          "value": 222,
          "type": "income"
        }
      ]
    },
    {
      "id": 2,
      "name": "Fernando",
      "cpf": "9214573.741-10",
      "email": "aqui@mesmo.org",
      "age": 22,
      "transaction": []
    },
    {
      "id": 3,
      "name": "marcelo",
      "cpf": "9214573.331-10",
      "email": "aqui@mesmo.org",
      "age": 55,
      "transaction": [
        {
          "id": 3,
          "title": "aaa",
          "value": 222,
          "type": "income"
        }
      ]
    }
  ]

class User {
  constructor(public id:number, public name:string, public cpf:string, public email:string, public age:number, public transaction?: Transaction[]) {}
  }
  class Transaction {
    constructor( public id: number, public title:string,  public value: number, public type: string ){}
  }

//======= id EXISTE ?
function idExist(id:number): boolean {
  if (AllUsers.findIndex(elm => elm.id == id) >=0 ) return true
  return false
}

//====== TRANSAÇÃO EXISTE ?
function transExist(Uid:number, Tid: number): boolean {
  if (AllUsers[Uid].transaction!.findIndex(elm => elm.id == Tid) >= 0)  return true
  else return false
}

//======== CPF É ÚNICO ?
function unicpf(cpf:string):boolean {
  if (AllUsers.find(elm => elm.cpf == cpf )) return true
  else return false
}

//================IDs
let Ident: number = AllUsers[AllUsers.length-1].id | 0
let Ttrans:number = 0

AllUsers.forEach(elm => {
    Ttrans = Ttrans + (elm.transaction!.length)
})
let trans: number = Ttrans - 1
//**********************************************************

//======ADICIONA USUARIO
app.post('/users/', (req: Request, res: Response) => {

  const { name, cpf, email, age }: { name: string; cpf: string; email: string; age: number } = req.body;

  if (name.length == 0) {
    return res.status(400).send(`<h1>Campo nome vazio</h1>`)
    res.end()
  }
  if (cpf.length == 0) {
    return res.status(400).send(`<h1>Campo CPF vazio</h1>`)
    res.end()
  }
  if (email.length == 0) {
    return res.status(400).send(`<h1>Campo email vazio</h1>`)
    res.end()
  }
  if (age <= 0) {
    return res.status(400).send(`<h1>Campo idade vazio</h1>`)
    res.end()
  }

  if (!unicpf(cpf)) {
    Ident++
    const Reg:User = new User(Ident, name, cpf, email, age)
    AllUsers.push(Reg)
    return res.status(201).json(AllUsers)
  }
  else return res.status(400).send(`<h1>CPF ${cpf} já castrado</h1>`)

})

//======ADICONA TRANSAÇÕES
app.post('/user/:userid/transactions/', (req: Request, res: Response) => {

  const userID:number = Number(req.params.userid)
  const { title, value, type }: { title: string; value: number; type: string } = req.body;
  const Nvalue = Number(value)

  if (title.length == 0) {
    return res.status(400).send(`<h1>Campo title vazio</h1>`)
    res.end()
  }
  if (value <= 0) {
    return res.status(400).send(`<h1>Campo value vazio</h1>`)
    res.end()
  }
  if ((type != "income" && type != "outcome") || type.length == 0) {
    return res.status(400).send(`<h1>Transção inválida</h1>`)
    res.end()
  }
  trans++
  const RegTrans:Transaction = new Transaction(trans, title, Nvalue, type)
  AllUsers[userID].transaction!.push(RegTrans)

  res.status(200).send(`<h1>Transação para usuario ${AllUsers[userID].name} cadastrada</h1>`)
})

//=======MOSTRA UM USUARIO SEM AS TRANSAÇÕES
app.get('/users/:id', (req: Request, res: Response) => {
  const userID:number = Number(req.params.id)
  const Nuser = {...AllUsers[userID]}
  delete Nuser.transaction
  return res.status(201).json(Nuser)
})

//========MOSTRA TODOS OS USUARIOS SEM AS TRANSAÇÕES
app.get('/users/', (req: Request, res: Response) => {
  const Newarr = [...AllUsers ]
  Newarr.forEach(elm => delete elm.transaction)
  return res.json(Newarr)
})

//=======APAGA UM USUARIO
app.delete('/user/:id', (req: Request, res: Response) => {
  const userID:number = Number(req.params.id)
  if(idExist(userID)){
    AllUsers.splice(userID,1)
  } else return res.status(400).send(`<h1>Usuario não existe</h1>`)
})

//========EDITA UM USUARIO
app.put('/user/:id', (req: Request, res: Response) => {
  const uID:number = Number(req.params.id)

  if (!idExist(uID)) return res.status(400).send(`<h1>Usuario não existe</h1>`)

  const { name, cpf, email, age }: { name: string; cpf: string; email: string; age: number } = req.body;

  if (name.length != 0 && name != AllUsers[uID].name) {
    AllUsers[uID].name = name
  }
  if (cpf.length != 0 && cpf != AllUsers[uID].cpf) {
    AllUsers[uID].cpf = cpf
  }
  if (email.length != 0 && email != AllUsers[uID].email) {
    AllUsers[uID].email = email
  }
  if (!isNaN(age) && age != AllUsers[uID].age) {
    AllUsers[uID].age = age
  }
  return  res.status(200).json(`${AllUsers[uID]}`)
})

//=======MOSTRA UMA TRANSAÇÃO DE UM USUÁRIO
app.post('/user/:userid/transaction/:trasid', (req: Request, res: Response) => {

  const uID:number = Number(req.params.userid)
  const tID:number = Number(req.params.transid)

  if (!idExist(uID)) return res.status(400).send(`<h1>Usuario não existe</h1>`)
  if (!transExist(uID,tID)) return res.status(400).send(`<h1>Transação não existe</h1>`)

  return  res.status(200).json(`${AllUsers[uID].transaction![tID]}`)
})

//========EDITA UMA TRANSAÇÃO
app.put('/user/:userid/transaction/:trasid', (req: Request, res: Response) => {

  const uID:number = Number(req.params.userid)
  const tID:number = Number(req.params.transid)

  if (!idExist(uID)) return res.status(400).send(`<h1>Usuario não existe</h1>`)
  if (!transExist(uID,tID)) return res.status(400).send(`<h1>Transação não existe</h1>`)

  const { title, value, type }: { title: string; value: number; type: string } = req.body;

  if (title.length != 0 && title != AllUsers[uID].transaction![tID].title) {
    AllUsers[uID].transaction![tID].title = title
  }
  if (!isNaN(value) && value != AllUsers[uID].transaction![tID].value) {
    AllUsers[uID].transaction![tID].value = value
  }
  if (type.length != 0 && type != AllUsers[uID].transaction![tID].type) {
    AllUsers[uID].transaction![tID].type = type
  }

  return  res.status(200).json(`${AllUsers[uID].transaction![tID]}`)
})

//=======APAGA UMA TRANSAÇÃO
app.delete('/user/:userid/transaction/:trasid', (req: Request, res: Response) => {

  const uID:number = Number(req.params.userid)
  const tID:number = Number(req.params.transid)

  if (!idExist(uID)) return res.status(400).send(`<h1>Usuario não existe</h1>`)
  if (!transExist(uID,tID)) return res.status(400).send(`<h1>Transação não existe</h1>`)

  AllUsers[uID].transaction!.splice(tID,1)

  return  res.status(200).json(`${AllUsers[uID].transaction}`)
})

//========CALCULA O SALDO DO USUARIO
app.get('/user/:id', (req: Request, res: Response) => {

  const uID:number = Number(req.params.id)

  if (!idExist(uID)) return res.status(400).send(`<h1>Usuario não existe</h1>`)
  if (typeof AllUsers[uID].transaction !== 'undefined' && AllUsers[uID].transaction!.length === 0)
    return res.status(400).send(`<h1>Usuario não tem transações</h1>`)

  let Positivo:number = 0
  let Negativo:number = 0

  for (let trans of AllUsers[uID].transaction!) {
      if (trans.type == "income") {
        Positivo = Positivo + trans.value
        console.log(`Depósito: ${trans.value}`)
      }
      else {
        Negativo = Negativo + trans.value
        console.log(`Retirada: ${trans.value}`)
      }
  }
  const Saldo = Positivo - Negativo
  console.log(`Saldo: ${Saldo}`)
  return  res.status(200).json(`Saldo total: ${Saldo}`)
})
