import { z } from "zod";

export abstract class ResourceBlock {
  public abstract key: string;

  public methods: Record<
    string,
    { inputSchema: Zod.ZodObject<any>; outputSchema: Zod.ZodObject<any> }
  > = {};

  maybeInitializeMethodRecord(methodName: string) {
    if (!this.methods[methodName]) {
      this.methods[methodName] = {
        inputSchema: z.object({}),
        outputSchema: z.object({}),
      };
    }
  }

  addInputSchemaToMethod(methodName: string, schema: Zod.ZodObject<any>) {
    this.maybeInitializeMethodRecord(methodName);
    this.methods[methodName].inputSchema = schema;
  }
  addOutputSchemaToMethod(methodName: string, schema: Zod.ZodObject<any>) {
    this.maybeInitializeMethodRecord(methodName);
    this.methods[methodName].outputSchema = schema;
  }

  static needs(schema: Zod.ZodObject<any>) {
    return (
      target: ResourceBlock,
      propertyKey: string | symbol,
      descriptor: PropertyDescriptor
    ) => {
      target.addInputSchemaToMethod(propertyKey.toString(), schema);
      const originalMethod = descriptor.value;
      descriptor.value = function (...args: any[]) {
        console.log("woo needs decorator", propertyKey);
        const result = originalMethod.apply(this, args);
        return result;
      };

      return descriptor;
    };
  }

  static provides(schema: Zod.ZodObject<any>) {
    return (
      target: ResourceBlock,
      propertyKey: string | symbol,
      descriptor: PropertyDescriptor
    ) => {
      target.addOutputSchemaToMethod(propertyKey.toString(), schema);
      const originalMethod = descriptor.value;
      descriptor.value = function (...args: any[]) {
        console.log("woo provides decorator", propertyKey);
        const result = originalMethod.apply(this, args);
        return result;
      };

      return descriptor;
    };
  }

  getInputSchemaForDependency() {}
}
