import type { Loader, LoaderConfig } from ".";
import { ClassicFileLoader } from "./classic";
import { ResourceFileLoader } from "./resource";

export function generateLoader(loaderConfig: LoaderConfig): any { // running into some issues with getting it to return generics right now
	if (loaderConfig.loaderType === "classic") return new ClassicFileLoader(loaderConfig);
	else if (loaderConfig.loaderType === "resource") return new ResourceFileLoader(loaderConfig);
	else 
	{
		throw new Error("LoaderFactory called with unknown loaderType");
	}
}