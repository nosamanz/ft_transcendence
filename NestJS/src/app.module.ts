import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres', // Veritabanı tipi (örneğin: mysql, postgres, sqlite)
    host: 'localhost', // Veritabanı sunucu adresi
    port: 5432, // Veritabanı portu
    username: 'postgres', // Veritabanı kullanıcı adı
    password: '1234', // Veritabanı şifresi
    database: 'psqldb', // Kullanılacak veritabanı adı
    entities: [ User ], // Veritabanı tablolarınızın entity sınıfları
    synchronize: true, // Eğer true ise, entity sınıflarıyla veritabanı tablolarını senkronize eder (sadece geliştirme aşamasında kullanılmalı)
  }),
  UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
