import { z } from "zod";

export abstract class ResourceBlock {
  public abstract key: string;

  public static methods: Record<
    string,
    { inputSchema: Zod.ZodObject<any>; outputSchema: Zod.ZodObject<any> }
  > = {};

  static maybeInitializeMethodRecord(methodName: string) {
    if (!this.methods[methodName]) {
      this.methods[methodName] = {
        inputSchema: z.object({}),
        outputSchema: z.object({}),
      };
    }
  }

  static addInputSchemaToMethod(
    methodName: string,
    schema: Zod.ZodObject<any>
  ) {
    this.maybeInitializeMethodRecord(methodName);
    this.methods[methodName]!.inputSchema = schema;
  }
  static addOutputSchemaToMethod(
    methodName: string,
    schema: Zod.ZodObject<any>
  ) {
    this.maybeInitializeMethodRecord(methodName);
    this.methods[methodName]!.outputSchema = schema;
  }

  static needs(schema: Zod.ZodObject<any>) {
    return (
      target: ResourceBlock,
      propertyKey: string | symbol,
      descriptor: PropertyDescriptor
    ) => {
      ResourceBlock.addInputSchemaToMethod(propertyKey.toString(), schema);
    };
  }

  static provides(schema: Zod.ZodObject<any>) {
    return (
      target: ResourceBlock,
      propertyKey: string | symbol,
      descriptor: PropertyDescriptor
    ) => {
      ResourceBlock.addOutputSchemaToMethod(propertyKey.toString(), schema);
    };
  }

  getInputSchemaForDependency() {}
}
