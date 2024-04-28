interface ISpecifications {
    screen_size: number;
    memory: number;
    pin: number;
    ram: number;
}
interface IVariants {
    _id: string;
    quantity: number;
    price: number;
    sold: number;
    color: string;
    image: string;
}

interface IRatings {
    star: number;
    comment: string;
    posted: User
}

interface IProduct {
    _id: string;
    name: string;
    slug: string;
    description: string;
    specifications: ISpecifications;
    variants: IVariants[];
    brand: string;
    seller: IUser;
    likes: number;
    dislikes: number;
    numViews: number;
    isLiked: boolean;
    isDisliked: boolean;
    ratings: IRatings[];
    totalRatings: string;
}