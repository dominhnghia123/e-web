interface ISpecifications {
    screen_size: string;
    memory: string;
    pin: string;
    ram: string;
}
interface IVariants {
    _id: string;
    quantity: string;
    price: string;
    sold: string;
    color: string;
    image: string;
}

interface IRatings {
    star: string;
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
    likes: string;
    dislikes: string;
    numViews: string;
    isLiked: boolean;
    isDisliked: boolean;
    ratings: IRatings[];
    totalRatings: string;
    createdAt: date;
    updatedAt: date;
}