import { Routes } from 'nest-router';
import { AuthModule } from "./modules/auth/auth.module";
import { TodoModule } from "./modules/todo/todo.module";
import { UserModule } from './modules/user/user.module';

export const routes: Routes = [
    {
        path: '/api/v1',
        children: [
            {
                path: '/auth',
                module: AuthModule,
            },
            {
                path: '/user',
                module: UserModule
            }
            {
                path: '/todo',
                module: TodoModule,
            }
        ]
    }
];
