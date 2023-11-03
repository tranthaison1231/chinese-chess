export const getAssetSrc = (name: string) => {
	const path = `/src/lib/assets/images/${name}`;
	const modules = import.meta.glob('/src/lib/assets/images/*', { eager: true });
	const mod = modules[path] as { default: string };
	return mod.default;
};
