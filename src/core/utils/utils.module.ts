import { MomentModule } from "@ccmos/nestjs-moment";
import { Module } from "@nestjs/common";
import { UrlHelper } from "./url.helper";

@Module({
  imports: [MomentModule.forRoot({ tz: 'America/New_York'})],
	providers: [UrlHelper],
  exports: [UrlHelper, MomentModule],
})
export class UtilsModule {}