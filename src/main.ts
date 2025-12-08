/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { UserModule } from './user.module';

async function bootstrap() {
  dotenv.config(); // Load .env file
  console.log(process.env.DATABASE_URL);

  // Set the host and port from environment variables
  const host = process.env.USER_SERVICE_HOST || 'localhost';
  const port = Number(process.env.USER_SERVICE_PORT) || 5005;

  // Determine if we are in production or development
  // const isProduction = process.env.NODE_ENV === 'production';

  // Define the path for the user.proto file based on the environment
  const userProtoPath = join(process.cwd(), 'src/proto/user.proto'); // Adjust based on actual file location
  // This assumes the `proto` folder is at the root level of your project
  // If the proto file is located in the "proto" folder at the root level.

  // Create the NestJS microservice with gRPC transport
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'user', // must match proto package
        protoPath: userProtoPath, // use the correct proto file path
        url: `${host}:${port}`, // gRPC server URL
      },
    },
  );

  // Start the microservice
  await app.listen();
  console.log(`✅ User Microservice is running on gRPC: ${host}:${port}`);
}

// Bootstrap the application
bootstrap();
