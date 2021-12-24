import { Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { ContentsModule } from "src/contents/contents.module";
import { JwtAuthModule } from "../authentication/jwt/jwt-auth.module";
import { UtilsModule } from "../utils/utils.module";

@Module({  
	imports: [
		UtilsModule, UsersModule, 
		ContentsModule, JwtAuthModule
	],
})
export class FilterModule { }