import { InternalServerErrorException } from "@nestjs/common";

export const handleUnknowError = (err) => {
  console.debug(err);
  throw new InternalServerErrorException();
}