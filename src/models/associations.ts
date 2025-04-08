import User from "./User";
import Place from "./Place";
import Address from "./Address";
import Rent from "./Rent";
import Rating from "./Rating";
import Equipment from "./Equipment";

// === USER ===
User.hasMany(Place, { foreignKey: "ownerId", as: "places" });
User.hasMany(Rent, { foreignKey: "renterId", as: "rentsAsRenter" });
User.hasMany(Rent, { foreignKey: "ownerId", as: "rentsAsOwner" });
User.hasMany(Rating, { foreignKey: "reviewerId", as: "ratingsGiven" });
User.hasMany(Rating, { foreignKey: "reviewedId", as: "ratingsReceived" });

// === PLACE ===
Place.belongsTo(User, { foreignKey: "ownerId", as: "owner" });
Place.belongsTo(Address, { foreignKey: "addressId", as: "address" });
Place.hasMany(Rent, { foreignKey: "placeId", as: "rents" });
Place.hasMany(Equipment, { foreignKey: "place_id", as: "equipments" });
Place.hasMany(Rating, { foreignKey: "placeId", as: "ratings" }); // Opcional

// === ADDRESS ===
Address.hasOne(Place, { foreignKey: "addressId", as: "place" });

// === RENT ===
Rent.belongsTo(User, { foreignKey: "renterId", as: "renter" });
Rent.belongsTo(User, { foreignKey: "ownerId", as: "owner" });
Rent.belongsTo(Place, { foreignKey: "placeId", as: "place" });
Rent.hasMany(Rating, { foreignKey: "rentId", as: "ratings" });

// === RATING ===
Rating.belongsTo(User, { foreignKey: "reviewerId", as: "reviewer" });
Rating.belongsTo(User, { foreignKey: "reviewedId", as: "reviewed" });
Rating.belongsTo(Rent, { foreignKey: "rentId", as: "rent" });

// === EQUIPMENT ===
Equipment.belongsTo(Place, { foreignKey: "place_id", as: "place" });
