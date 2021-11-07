import express, {Request, Response} from 'express';
import 'dotenv/config'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', function(req, res){
    res.sendfile('index.html', { root: __dirname + "/public" } );
});

const port = process.env.PORT || 7777

app.listen(port, () => {
	console.log(`Server up on PORT ${port}`)
});

//========================================================

class Transaction {
		constructor( public id: number, public title:string,  public value: number, public type: string ){}
	}

class User {
  constructor(public id:number, public name:string, public cpf:string, public email:string, public age:number, public transaction: Transaction[]=[]) {}
  }

let AllUsers:User[] = [
    {
      id: 0,
      name: "Marcio",
      cpf: "9211573.741-30",
      email: "aqui@mesmo.org",
      age: 22,
      transaction: [
        {
          id: 0,
          title: "TTT",
          value: 100,
          type: "income"
        },
        {
          id: 1,
          title: "WWW",
          value: 50,
          type: "outcome"
        }
      ]
    },
    {
      id: 1,
      name: "Paulo",
      cpf: "9214573.741-30",
      email: "aqui@mesmo.org",
      age: 33,
      transaction: [
        {
          id: 2,
          title: "aaa",
          value: 222,
          type: "income"
        }
      ]
    },
    {
      id: 2,
      name: "Fernando",
      cpf: "9214573.741-10",
      email: "aqui@mesmo.org",
      age: 22,
      transaction: []
    },
    {
      id: 3,
      name: "marcelo",
      cpf: "9214573.331-10",
      email: "aqui@mesmo.org",
      age: 55,
      transaction: [
        {
          id: 3,
          title: "aaa",
          value: 222,
          type: "income"
        }
      ]
    }
  ]

//======= INDICE DA transaction CUJO id É O PASSADO
function indi_id(userID:number, transID: number): number {
	const indice = AllUsers[userID].transaction.findIndex(elm => elm.id == transID)
	return indice
}

//======= id EXISTE ?
function idExist(id:number): boolean {
  if (AllUsers.findIndex(elm => elm.id == id) >=0 ) return true
  return false
}

//====== TRANSAÇÃO EXISTE ?
function transExist(userID:number, transID: number): boolean {
  if (AllUsers[userID].transaction.findIndex(elm => elm.id == transID) >= 0)  return true
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
    Ttrans = Ttrans + (elm.transaction.length)
})
let trans: number = Ttrans - 1
//**********************************************************

//******************************* POSTs
//======ADICIONA USUARIO
app.post('/users', (req: Request, res: Response) => {

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
		let tempTrans:Transaction[] = []
    const Reg:User = new User(Ident, name, cpf, email, age, tempTrans)
    AllUsers.push(Reg)
    return res.status(201).json(AllUsers[Ident])
  }
  else return res.status(400).send(`<h1>CPF ${cpf} já castrado</h1>`)
})

//======ADICONA TRANSAÇÕES
app.post('/user/:userid/transactions', (req: Request, res: Response) => {
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
	if (!idExist(userID)) {
		return res.status(400).send(`<h1>Usuário ${userID} não existe</h1>`)
    res.end()
	}
  trans++
  const RegTrans:Transaction = new Transaction(trans, title, Nvalue, type)
  AllUsers[userID].transaction.push(RegTrans)
  res.status(200).send(`<h1>Transação para usuario ${AllUsers[userID].name} cadastrada</h1>`)
})

//******************************* GETs
//=======MOSTRA UM USUARIO SEM AS TRANSAÇÕES
app.get('/users/:id', (req: Request, res: Response) => {
  const userID:number = Number(req.params.id)

	const { transaction, ...Nuser} = AllUsers[userID]

	AllUsers[userID].transaction.forEach(elm => console.log(`TransID: ${elm.id}`))
  return res.status(201).json(Nuser)
})

//========MOSTRA TODOS OS USUARIOS SEM AS TRANSAÇÕES
app.get('/users', (req: Request, res: Response) => {

	const Newarr:any[] = []
	AllUsers.forEach( (elm) => {
		const { transaction, ...User_sem_trans } = elm
		Newarr.push(User_sem_trans)
	})

	return res.json(Newarr)
})

//=======MOSTRA UMA TRANSAÇÃO DE UM USUÁRIO
app.get('/user/:userid/transaction/:transid', (req: Request, res: Response) => {

  const userID:number = Number(req.params.userid)
  const transID:number = Number(req.params.transid)

  if (!idExist(userID)) return res.status(400).send(`<h1>Usuario não existe</h1>`)
  if (!transExist(userID, transID)) return res.status(400).send(`<h1>Transação não existe</h1>`)

	const indice = indi_id(userID,transID)
	const saida = AllUsers[userID].transaction[indice]
  return  res.status(200).json(saida)
})

//========CALCULA O SALDO DO USUARIO
app.get('/user/:id', (req: Request, res: Response) => {

	const userID:number = Number(req.params.id)

	if (!idExist(userID)) return res.status(400).send(`<h1>Usuario não existe</h1>`)
	if (typeof AllUsers[userID].transaction !== 'undefined' && AllUsers[userID].transaction.length === 0)
	return res.status(400).send(`<h1>Usuario não tem transações</h1>`)

	let Positivo:number = 0
	let Negativo:number = 0

	AllUsers[userID].transaction.forEach(trans => {
		if (trans.type == "income") {
			Positivo = Positivo + trans.value
			console.log(`Depósito: ${trans.value}`)
		}
		else {
			Negativo = Negativo + trans.value
			console.log(`Retirada: ${trans.value}`)
		}
	})

	const Saldo = Positivo - Negativo
	console.log(`Saldo: ${Saldo}`)
	return  res.status(200).json(`Saldo total: ${Saldo}`)
})

//******************************** PUTs
//========EDITA UM USUARIO
app.put('/user/:id', (req: Request, res: Response) => {
	const userID:number = Number(req.params.id)

	if (!idExist(userID)) return res.status(400).send(`<h1>Usuario não existe</h1>`)

	const { name, cpf, email, age }: { name: string; cpf: string; email: string; age: number } = req.body;
	// CPF é imutável

	if (name.length != 0 && name != AllUsers[userID].name) {
		AllUsers[userID].name = name
	}
	if (email.length != 0 && email != AllUsers[userID].email) {
		AllUsers[userID].email = email
	}
	if (!isNaN(age) && age != AllUsers[userID].age) {
		AllUsers[userID].age = age
	}
	const saida = AllUsers[userID]
	return  res.status(200).json(saida)
})

//========EDITA UMA TRANSAÇÃO
app.put('/user/:userid/transaction/:transid', (req: Request, res: Response) => {

  const userID:number = Number(req.params.userid)
  const transID:number = Number(req.params.transid)

  if (!idExist(userID)) return res.status(400).send(`<h1>Usuario não existe</h1>`)
  if (!transExist(userID,transID)) return res.status(400).send(`<h1>Transação não existe</h1>`)

  const { title, value, type }: { title: string; value: number; type: string } = req.body;

	const indice = indi_id(userID,transID)

  if (title.length != 0 && title != AllUsers[userID].transaction[indice].title) {
    AllUsers[userID].transaction[indice].title = title
  }
  if (!isNaN(value) && value != AllUsers[userID].transaction[indice].value) {
    AllUsers[userID].transaction[indice].value = value
  }
  if (type.length != 0 && type != AllUsers[userID].transaction[indice].type) {
    AllUsers[userID].transaction[indice].type = type
  }

	const saida = AllUsers[userID].transaction[indice]

  return  res.status(200).json(saida)
})

//******************************** DELETEs
//=======APAGA UM USUARIO
app.delete('/user/:id', (req: Request, res: Response) => {
	const userID:number = Number(req.params.id)

	if(idExist(userID)){
		const saida = AllUsers[userID]
		AllUsers.splice(userID,1)
		return  res.status(200).json(saida)
	} else return res.status(400).send(`<h1>Usuario não existe</h1>`)
})

//=======APAGA UMA TRANSAÇÃO
app.delete('/user/:userid/transaction/:transid', (req: Request, res: Response) => {

  const userID:number = Number(req.params.userid)
  const transID:number = Number(req.params.transid)

  if (!idExist(userID)) return res.status(400).send(`<h1>Usuario não existe</h1>`)
  if (!transExist(userID,transID)) return res.status(400).send(`<h1>Transação não existe</h1>`)

	const indice = indi_id(userID,transID)
  const removida = AllUsers[userID].transaction.splice(indice,1)

  return  res.status(200).json(removida)
})
