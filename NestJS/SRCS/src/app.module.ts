import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';
import { ChatService } from './chat/chat.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';


@Module({
  // imports: [TypeOrmModule.forRoot({
  //   type: 'postgres', // Veritabanı tipi (örneğin: mysql, postgres, sqlite)
  //   host: 'postgres', // Veritabanı sunucu adresi
  //   port: 5432, // Veritabanı portu
  //   username: 'postgres', // Veritabanı kullanıcı adı
  //   password: '1234', // Veritabanı şifresi
  //   database: 'postgres', // Kullanılacak veritabanı adı
  //   entities: [ User ], // Veritabanı tablolarınızın entity sınıfları
  //   synchronize: true, // Eğer true ise, entity sınıflarıyla veritabanı tablolarını senkronize eder (sadece geliştirme aşamasında kullanılmalı)
  // }),
  imports: [TypeOrmModule.forRoot({
    type: 'postgres', // Veritabanı tipi (örneğin: mysql, postgres, sqlite)
    host: 'localhost', // Veritabanı sunucu adresi
    port: 5432, // Veritabanı portu
    username: 'postgres', // Veritabanı kullanıcı adı
    password: '1234', // Veritabanı şifresi
    database: 'postgres', // Kullanılacak veritabanı adı
    entities: [ User ], // Veritabanı tablolarınızın entity sınıfları
    synchronize: true, // Eğer true ise, entity sınıflarıyla veritabanı tablolarını senkronize eder (sadece geliştirme aşamasında kullanılmalı)
  }),
  UsersModule,
  ChatModule,
  AuthModule,],
  controllers: [AppController],
  providers: [AppService, ChatGateway, ChatService, AuthService],
})
export class AppModule {}
