import { MongoClient, Db } from 'mongodb';

class MongoDBConnection {
  private static instance: MongoDBConnection;
  private client: MongoClient | null = null;
  private db: Db | null = null;

  static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }
    return MongoDBConnection.instance;
  }

  async connect(): Promise<void> {
    try {
      if (this.client) {
        console.log('MongoDB já está conectado');
        return;
      }

      this.client = new MongoClient(process.env.MONGODB_URI || '');
      await this.client.connect();
      this.db = this.client.db('project');
      
      console.log('Conectado ao MongoDB com sucesso');
    } catch (error) {
      console.error('Erro ao conectar ao MongoDB:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.client) {
        await this.client.close();
        this.client = null;
        this.db = null;
        console.log('Desconectado do MongoDB');
      }
    } catch (error) {
      console.error('Erro ao desconectar do MongoDB:', error);
      throw error;
    }
  }

  getDatabase(): Db {
    if (!this.db) {
      throw new Error('Banco de dados não está conectado');
    }
    return this.db;
  }

  isConnected(): boolean {
    return this.client !== null && this.db !== null;
  }

  setupGracefulShutdown(): void {
    const shutdownHandler = async (signal: string) => {
      console.log(`\n${signal} recebido. Fechando conexão com MongoDB...`);
      await this.disconnect();
      process.exit(0);
    };

    process.on('SIGINT', () => shutdownHandler('SIGINT'));
    process.on('SIGTERM', () => shutdownHandler('SIGTERM'));
    process.on('SIGUSR2', () => shutdownHandler('SIGUSR2')); // nodemon restart
  }
}

export default MongoDBConnection;
