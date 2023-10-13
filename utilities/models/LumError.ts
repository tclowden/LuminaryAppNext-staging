export class LumError extends Error {
   statusCode: number = 400;
   errorMessage: string = '';

   constructor(statusCode = 500, errorMessage = 'Default Error...') {
      super(errorMessage);
      this.statusCode = statusCode;
      this.errorMessage = errorMessage;
   }

   setStatusCode(statusCode: number) {
      this.statusCode = statusCode;
      return this;
   }

   setErrorMessage(errorMessage: string) {
      this.errorMessage = errorMessage;
      return this;
   }

   getErrorMessage() {
      return this.errorMessage;
   }

   getStatusCode() {
      return this.statusCode;
   }

   getErrorObj() {
      return {
         statusCode: this.statusCode,
         errorMessage: this.errorMessage,
      };
   }
}
