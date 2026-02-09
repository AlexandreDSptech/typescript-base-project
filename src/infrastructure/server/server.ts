import Fastify from 'fastify'
import cors from '@fastify/cors'
import * as dotenv from 'dotenv'
import { mongoConnection } from '../db/mongodb'
import { PersonController } from '../../app/person/person-controller';

dotenv.config()

const server = Fastify()

async function start() {
  try {
    // 1. Conectar ao MongoDB PRIMEIRO
    await mongoConnection.connect()
    mongoConnection.setupGracefulShutdown()
    console.log('MongoDB conectado')

    // 2. Registrar plugins
    await server.register(cors, { origin: true })

    // 3. Middleware para configurar CSP
    server.addHook('onSend', async (request, reply, payload) => {
      reply.header('Content-Security-Policy', `default-src 'self'; connect-src 'self' ${process.env.API_URL || 'http://localhost:3000'};`);
      return payload;
    })

    // 4. Instanciar controllers DEPOIS da conexão
    const personController = new PersonController()

    // 5. Registrar rotas
    server.post("/people", (request: any, response) => {
      return personController.insert(request.body)
    })
    server.get("/people", (request: any, response) => {
      return personController.findAll(request.query || {})
    })
    server.get("/people/:id", (request: any, response) => {
      return personController.findById(request.params.id)
    })
    server.delete("/people/:id", (request: any, response) => {
      return personController.delete(request.params.id)
    })
    // server.patch("/people/:id",(request:any,response)=>{
    //     return personController.update(request)
    // })

    // 6. Iniciar servidor
    await server.listen({
      host: "0.0.0.0",
      port: process.env.PORT ?? 3000,
    } as any)

    console.log(`Servidor rodando na porta ${process.env.PORT ?? 3000}`)
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error)
    process.exit(1)
  }
}

start()
