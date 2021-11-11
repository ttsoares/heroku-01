import express, {Request, Response} from 'express';
const app = express();

import 'dotenv/config'

import cors from 'cors';
app.use(cors())

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
      cpf: "0000000.000-00",
      email: "marcio@mesmo.org",
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
      cpf: "1111111.111-11",
      email: "paulo@mesmo.org",
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
      cpf: "2222222.222-22",
      email: "fernando@mesmo.org",
      age: 22,
      transaction: []
    },
    {
      id: 3,
      name: "marcelo",
      cpf: "3333333.333-33",
      email: "marcelo@mesmo.org",
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
function indi_id(Uindice:number, transID: number): number {
	const indice = AllUsers[Uindice].transaction.findIndex(elm => elm.id == transID)
	return indice
}

//======= INDICE DO usuario CUJO id É O PASSADO
function indi_user(userID:number): number {
	const indice = AllUsers.findIndex(elm => elm.id == userID)
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
app.get('/', function(req, res){
    res.send(`<!DOCTYPE html><html lang=en><meta charset=UTF-8><meta content="width=device-width,initial-scale=1"name=viewport><meta content="ie=edge"http-equiv=X-UA-Compatible><title>Back-eng na nuvel</title><style>body{background-color:#333}h1{color:#00f;font-size:4rem}h3{color:green;font-size:1rem}h4{color:pink;font-weight:700;font-size:2rem;margin:0}h5,h6{color:#fff;font-size:1.5rem;padding:0;line-height:.9;margin:12px}h6{text-indent:20px}li{color:#ff0;font-size:2rem}.wraper{display:flex;flex-direction:row}.trans{font-style:italic;color:#90ee90}.div1,.div2{padding:20px;justify-content:center}</style><div class=wraper><div class=div1><h1>Rotas Dispovíveis</h1><ul><li>delete('/user/:userid/transaction/:trasid)<li>delete('/user/:id')<li>------------------------------------------<li>put('/user/:userid/transaction/:trasid')<li>put('/user/:id')<li>------------------------------------------<li>get('/user/:id')<li>get('/users')<li>get('/users/:id')<li>get('/user/:userid/transaction/:transid')<li>-----------------------------------------<li>post('/user/:userid/transactions')<li>post('/users')</ul></div><div class=div2><h1>Objetos iniciais</h1><h3><h4>id: 0,</h4><h5>name: "Marcio",</h5><h5>cpf: "9211573.741-30",</h5><h5>email: "aqui@mesmo.org",</h5><h5>age: 22,</h5><h5 class=trans>transaction:</h5><h6>id: 0,</h6><h6>title: "TTT",</h6><h6>value: 100,</h6><h6>type: "income"</h6><h6>-----------</h6><h6>id: 1,</h6><h6>title: "WWW",</h6><h6>value: 50,</h6><h6>type: "outcome"</h6><h5>------------------------</h5><h4>id: 1,</h4><h5>name: "Paulo",</h5><h5>cpf: "9214573.741-30",</h5><h5>email: "aqui@mesmo.org",</h5><h5>age: 33,</h5><h5 class=trans>transaction:</h5><h6>id: 2,</h6><h6>title: "aaa",</h6><h6>value: 222,</h6><h6>type: "income"</h6><h5>---------------------------</h5><h4>id: 2,</h4><h5>name: "Fernando",</h5><h5>cpf: "9214573.741-10",</h5><h5>email: "aqui@mesmo.org",</h5><h5>age: 22,</h5><h5 class=trans>transaction: []</h5>-------------------------<h4>id: 3,</h4><h5>name: "marcelo",</h5><h5>cpf: "9214573.331-10",</h5><h5>email: "aqui@mesmo.org",</h5><h5>age: 55,</h5><h5 class=trans>transaction:</h5><h6>id: 3,</h6><h6>title: "aaa",</h6><h6>value: 222,</h6><h6>type: "income"</h6></h3></div></div>`)
});
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

		const Uindice:number = AllUsers.length - 1

		const data:object = {id:AllUsers[Uindice].id, nome:AllUsers[Uindice].name, idade:AllUsers[Uindice].age, cpf:AllUsers[Uindice].cpf,email:AllUsers[Uindice].email}

		res.render('um_user', {data: data});
  }
  else return res.status(400).send(`<h1>CPF ${cpf} já castrado</h1>`)
})

//======ADICONA TRANSAÇÕES
app.post('/user/:userid/transactions', (req: Request, res: Response) => {
  const userID:number = Number(req.params.userid)

	if (!idExist(userID)) return res.status(400).send(`<h1>Usuario não existe</h1>`)
	const Uindice:number = indi_user(userID)

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
  AllUsers[Uindice].transaction.push(RegTrans)

	const Tindice:number = AllUsers[Uindice].transaction.length - 1

	const data:object = {nome:AllUsers[userID].name, trans: AllUsers[userID].transaction[Tindice]}

	res.status(200),res.render('uma_trans', {data: data});
})

//******************************* GETs
//=======MOSTRA UM USUARIO SEM AS TRANSAÇÕES
app.get('/users/:id', (req: Request, res: Response) => {
	const userID:number = Number(req.params.id)

	if (!idExist(userID)){
		const data:object = {erro: "Usário não encontrado"}
		res.status(400),res.render('error', {data: data});
		return
		//return res.status(200).send(`<h1>Usuario não existe</h1>`)
	}

	const Uindice:number = indi_user(userID)

	const { transaction, ...Nuser} = AllUsers[Uindice]

	//mostra os IDs das transações do user no console
	AllUsers[Uindice].transaction.forEach(elm => console.log(`TransID: ${elm.id}`))

	const data:object = {id:AllUsers[Uindice].id, nome:AllUsers[Uindice].name, idade:AllUsers[Uindice].age, cpf:AllUsers[Uindice].cpf,email:AllUsers[Uindice].email}

	res.status(200),res.render('um_user', {data: data});
})

//========MOSTRA TODOS OS USUARIOS SEM AS TRANSAÇÕES
app.get('/users', (req: Request, res: Response) => {

	const users:any[] = []
	AllUsers.forEach( (elm) => {
		const { transaction, ...User_sem_trans } = elm
		users.push(User_sem_trans)
	})

	res.status(200),res.render('todos_users', {users});
})

//=======MOSTRA UMA TRANSAÇÃO DE UM USUÁRIO
app.get('/user/:userid/transaction/:transid', (req: Request, res: Response) => {

  const userID:number = Number(req.params.userid)
  const transID:number = Number(req.params.transid)

  if (!idExist(userID)) return res.status(400).send(`<h1>Usuario não existe</h1>`)

	const Uindice:number = indi_user(userID)

  if (!transExist(Uindice, transID)) return res.status(400).send(`<h1>Transação não existe</h1>`)

	const Tindice = indi_id(Uindice,transID)

	const data:object = {nome:AllUsers[Uindice].name, trans: AllUsers[Uindice].transaction[Tindice]}

	res.status(200),res.render('uma_trans', {data: data});
})

//========CALCULA O SALDO DO USUARIO
app.get('/user/:id', (req: Request, res: Response) => {

	const userID:number = Number(req.params.id)

	if (!idExist(userID)) return res.status(400).send(`<h1>Usuario não existe</h1>`)

	const Uindice:number = indi_user(userID)

	if (typeof AllUsers[Uindice].transaction !== 'undefined' && AllUsers[Uindice].transaction.length === 0)
	return res.status(400).send(`<h1>Usuario não tem transações</h1>`)

	let Positivo:number = 0
	let Negativo:number = 0

	AllUsers[Uindice].transaction.forEach(trans => {
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

	const data:object = {nome:AllUsers[userID].name, income:Positivo, outcome: Negativo, saldo: Saldo}

	res.status(200),res.render('saldo', {data: data});
})

//******************************** PUTs
//========EDITA UM USUARIO
app.put('/user/:id', (req: Request, res: Response) => {
	const userID:number = Number(req.params.id)

	if (!idExist(userID)) return res.status(400).send(`<h1>Usuario não existe</h1>`)

	const { name, cpf, email, age }: { name: string; cpf: string; email: string; age: number } = req.body;
	// CPF é imutável

	const Uindice:number = indi_user(userID)

	if (name.length != 0 && name != AllUsers[Uindice].name) {
		AllUsers[Uindice].name = name
	}
	if (email.length != 0 && email != AllUsers[userID].email) {
		AllUsers[Uindice].email = email
	}
	if (!isNaN(age) && age != AllUsers[Uindice].age) {
		AllUsers[Uindice].age = age
	}

	const data:object = {id:AllUsers[Uindice].id, nome:AllUsers[Uindice].name, idade:AllUsers[Uindice].age, cpf:AllUsers[Uindice].cpf,email:AllUsers[Uindice].email}

	res.status(200),res.render('um_user', {data: data});
})

//========EDITA UMA TRANSAÇÃO
app.put('/user/:userid/transaction/:transid', (req: Request, res: Response) => {

  const userID:number = Number(req.params.userid)
  const transID:number = Number(req.params.transid)

  if (!idExist(userID)) return res.status(400).send(`<h1>Usuario não existe</h1>`)
	const Uindice:number = indi_user(userID)

  if (!transExist(Uindice,transID)) return res.status(400).send(`<h1>Transação não existe</h1>`)
	const Tindice = indi_id(Uindice,transID)

  const { title, value, type }: { title: string; value: number; type: string } = req.body;

	if (title.length != 0 && title != AllUsers[Uindice].transaction[Tindice].title) {
    AllUsers[Uindice].transaction[Tindice].title = title
  }
  if (!isNaN(value) && value != AllUsers[Uindice].transaction[Tindice].value) {
    AllUsers[Uindice].transaction[Tindice].value = value
  }
	if (type != "income" && type !="outcome") return res.status(400).send(`<h1>Transação invalida</h1>`)

  if (type.length != 0 && type != AllUsers[Uindice].transaction[Tindice].type) {
    AllUsers[Uindice].transaction[Tindice].type = type
  }
	const data:object = {nome:AllUsers[Uindice].name, trans: AllUsers[Uindice].transaction[Tindice]}
	res.status(200),res.render('uma_trans', {data: data});
})

//******************************** DELETEs
//=======APAGA UM USUARIO
app.delete('/user/:id', (req: Request, res: Response) => {
	const userID:number = Number(req.params.id)

	if(idExist(userID)){

		const indice:number = indi_user(userID)

		const data:object = {id:AllUsers[indice].id, nome:AllUsers[indice].name, idade:AllUsers[indice].age, cpf:AllUsers[indice].cpf,email:AllUsers[indice].email}

		AllUsers.splice(indice,1)


		res.status(200),res.render('del_user', {data: data});

	} else return res.status(400).send(`<h1>Usuario não existe</h1>`)
})

//=======APAGA UMA TRANSAÇÃO
app.delete('/user/:userid/transaction/:transid', (req: Request, res: Response) => {

  const userID:number = Number(req.params.userid)
  const transID:number = Number(req.params.transid)

  if (!idExist(userID)) return res.status(400).send(`<h1>Usuario não existe</h1>`)

	const Uindice:number = indi_user(userID)

  if (!transExist(Uindice,transID)) return res.status(400).send(`<h1>Transação não existe</h1>`)

	const Tindice = indi_id(Uindice,transID)

  const removida = AllUsers[Uindice].transaction.splice(Tindice,1)

  return  res.status(200).json(removida)
})
