import { Module } from "@nestjs/common";
import { JwtAuthModule } from "../authentication/jwt/jwt-auth.module";
import { UtilsModule } from "../utils/utils.module";

@Module({  
	imports: [UtilsModule, JwtAuthModule],
})
export class FilterModule { }