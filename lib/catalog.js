import catalog from '@/constants/catalog.json';

export const categories = catalog.categories;

/**
 * Flattens the nested catalog into a single product list. Every product keeps a
 * reference back to the category (and group, where it sits inside one) so detail
 * pages and the inquiry form can show the full path without walking the tree again.
 */
export const products = categories.flatMap((category) =>
    category.nodes.flatMap((node) => {
        const base = {
            category: category.name,
            categorySlug: category.slug,
        };

        if (node.type === 'group') {
            return node.products.map((product) => ({
                ...product,
                ...base,
                group: node.name,
                groupSlug: node.slug,
            }));
        }

        return [{ ...node, ...base, group: null, groupSlug: null }];
    })
);

export const productCount = products.length;

export function getProduct(slug) {
    return products.find((product) => product.slug === slug) || null;
}

export function getCategory(slug) {
    return categories.find((category) => category.slug === slug) || null;
}

/** Products in the same group, or the same category when the product stands alone. */
export function getRelatedProducts(product, limit = 3) {
    if (!product) return [];

    const sameGroup = products.filter(
        (candidate) =>
            candidate.slug !== product.slug &&
            (product.groupSlug
                ? candidate.groupSlug === product.groupSlug
                : candidate.categorySlug === product.categorySlug)
    );

    const fallback = products.filter(
        (candidate) =>
            candidate.slug !== product.slug &&
            candidate.categorySlug === product.categorySlug &&
            !sameGroup.includes(candidate)
    );

    return [...sameGroup, ...fallback].slice(0, limit);
}
