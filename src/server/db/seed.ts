import { eq } from "drizzle-orm";
import { db } from "./index";
import { rooms } from "./schema";

const initialRooms = [
  {
    slug: "la-em-001",
    name: "M_Dalats 001",
    roomNumber: "001",
    area: 18,
    maxAdults: 2,
    maxChildren: 2,
    bedType: "1 Giường Queen",
    viewType: "Sân vườn yên bình",
    pricePerNight: 850000,
    originalPrice: 1050000,
    image: "/images/LE_001_01-700x466.jpg",
    gallery: JSON.stringify([
      "/images/LE_001_01-700x466.jpg",
      "/images/DH_01791-HDR-Edit-700x466.jpg",
      "/images/DH_01328_2-pgvj0qxon4n8u4tqnzxuo0cafocg3jtjqw7qfalgc0.jpg"
    ]),
    shortDescription: "Phòng nghỉ ấm cúng tầng trệt với lối đi trực tiếp ra vườn hoa, nội thất gỗ cổ điển Tuscany.",
    description: "Phòng M_Dalats 001 mang vẻ đẹp nhẹ nhàng, tinh tế của phong cách đồng quê Ý. Phòng trang bị đầy đủ khóa từ, giường ngủ êm ái, bồn tắm nước nóng, máy sấy tóc, tủ lạnh mini và bộ trà cà phê miễn phí mỗi ngày.",
    amenities: JSON.stringify([
      "Khóa từ hiện đại",
      "Giường Queen êm ái",
      "Nước nóng 24/7",
      "Máy sấy tóc",
      "Két sắt an toàn",
      "Tivi thông minh",
      "Bộ tắm gội thảo mộc",
      "Wifi tốc độ cao",
      "Quạt trần cổ điển",
      "Ấm đun nước & trà miễn phí",
      "Tủ lạnh nhỏ",
      "Lối ra sân vườn riêng"
    ]),
    isAvailable: true,
  },
  {
    slug: "la-em-002",
    name: "M_Dalats 002",
    roomNumber: "002",
    area: 18,
    maxAdults: 2,
    maxChildren: 2,
    bedType: "1 Giường Queen",
    viewType: "Vườn hoa hồng",
    pricePerNight: 850000,
    originalPrice: 1050000,
    image: "/images/DH_01791-HDR-Edit-700x466.jpg",
    gallery: JSON.stringify([
      "/images/DH_01791-HDR-Edit-700x466.jpg",
      "/images/LE_001_01-700x466.jpg"
    ]),
    shortDescription: "Không gian lãng mạn hướng trọn góc vườn hoa hồng, thích hợp cho các cặp đôi tận hưởng sự tĩnh lặng.",
    description: "Nằm kề bên vườn hoa rực rỡ, M_Dalats 002 đem lại cảm giác yên bình tuyệt đối. Căn phòng ngập tràn ánh sáng tự nhiên với cửa sổ kính lớn, nội thất gỗ mộc mạc và tone màu kem ấm áp.",
    amenities: JSON.stringify([
      "Khóa từ an toàn",
      "Nước nóng cao cấp",
      "Smart TV kết nối Netflix",
      "Wifi phủ sóng toàn khu",
      "Mini bar & đồ uống nhẹ",
      "Máy sấy tóc",
      "Bộ mỹ phẩm hữu cơ",
      "Két sắt"
    ]),
    isAvailable: true,
  },
  {
    slug: "la-em-101",
    name: "M_Dalats 101",
    roomNumber: "101",
    area: 18,
    maxAdults: 2,
    maxChildren: 2,
    bedType: "1 Giường Queen",
    viewType: "Thung lũng & đồi thông",
    pricePerNight: 950000,
    originalPrice: 1150000,
    image: "/images/DH_02092-HDR-Edit-Edit-Edit-700x466.jpg",
    gallery: JSON.stringify([
      "/images/DH_02092-HDR-Edit-Edit-Edit-700x466.jpg",
      "/images/DH_01968-Pano-Edit-700x466.jpg"
    ]),
    shortDescription: "Phòng tầng 1 có ban công nhỏ nhìn ra ngọn đồi thông xanh và sương sớm Đà Lạt.",
    description: "Được chăm chút tỉ mỉ từng chi tiết, phòng M_Dalats 101 mang lại cảm giác thân thuộc như trở về ngôi nhà thứ hai. Buổi sáng bạn có thể mở toang rèm cửa để đón những vạt nắng dịu dàng luồn qua kẽ lá.",
    amenities: JSON.stringify([
      "Ban công ngắm cảnh",
      "Khóa thẻ từ",
      "Bình nước nóng & ấm trà",
      "Máy sấy tóc công suất lớn",
      "Két bảo mật",
      "Bàn làm việc nhỏ",
      "Wifi cực nhanh"
    ]),
    isAvailable: true,
  },
  {
    slug: "la-em-102",
    name: "M_Dalats 102",
    roomNumber: "102",
    area: 25,
    maxAdults: 2,
    maxChildren: 2,
    bedType: "1 Giường King lớn",
    viewType: "Toàn cảnh sân vườn & dốc thông",
    pricePerNight: 1150000,
    originalPrice: 1350000,
    image: "/images/DH_01968-Pano-Edit-700x466.jpg",
    gallery: JSON.stringify([
      "/images/DH_01968-Pano-Edit-700x466.jpg",
      "/images/DH_01866-HDR-Edit-700x466.jpg"
    ]),
    shortDescription: "Phòng Deluxe rộng rãi 25m2 với salon đọc sách thư giãn và cửa sổ kính mái vòm cổ điển.",
    description: "Phòng M_Dalats 102 là sự kết hợp hoàn mỹ giữa nét thanh lịch Châu Âu và cái lạnh ngọt ngào của Đà Lạt. Giường King size cao cấp cùng bộ ga đệm mềm mịn đảm bảo giấc ngủ trọn vẹn nhất cho bạn.",
    amenities: JSON.stringify([
      "Giường King Size 1m8",
      "Khu vực tiếp khách riêng",
      "Khóa từ hiện đại",
      "Smart TV màn hình rộng",
      "Két an toàn",
      "Phòng tắm rộng có vòi sen đứng",
      "Trà thảo mộc & Cà phê Cold brew"
    ]),
    isAvailable: true,
  },
  {
    slug: "la-em-103",
    name: "M_Dalats 103",
    roomNumber: "103",
    area: 25,
    maxAdults: 2,
    maxChildren: 2,
    bedType: "1 Giường King",
    viewType: "Vườn cây & không gian cafe",
    pricePerNight: 1150000,
    originalPrice: 1350000,
    image: "/images/DH_01866-HDR-Edit-700x466.jpg",
    gallery: JSON.stringify([
      "/images/DH_01866-HDR-Edit-700x466.jpg",
      "/images/DH_01382-HDR-Edit-700x466.jpg"
    ]),
    shortDescription: "Phòng nghỉ sang trọng với gam màu nâu gỗ trầm ấm, góc thư giãn đọc sách ngắm chiều buông.",
    description: "Tại M_Dalats 103, mọi ồn ào đô thị đều được gác lại bên ngoài. Bạn có thể tự pha một tách trà nóng, lắng nghe bản nhạc ballad du dương và thả hồn theo sương khói Đà Lạt.",
    amenities: JSON.stringify([
      "Bàn trà & ghế thư giãn bọc nhung",
      "Giường đệm lò xo túi êm ái",
      "Phòng tắm riêng biệt",
      "Điều hòa 2 chiều & Quạt trần",
      "Trà atiso tươi & cafe miễn phí"
    ]),
    isAvailable: true,
  },
  {
    slug: "la-em-104",
    name: "M_Dalats 104",
    roomNumber: "104",
    area: 25,
    maxAdults: 2,
    maxChildren: 2,
    bedType: "1 Giường King",
    viewType: "Dốc hoa dã quỳ & rặng thông",
    pricePerNight: 1250000,
    originalPrice: 1450000,
    image: "/images/DH_01382-HDR-Edit-700x466.jpg",
    gallery: JSON.stringify([
      "/images/DH_01382-HDR-Edit-700x466.jpg",
      "/images/DH_01539-HDR-Edit-700x466.jpg"
    ]),
    shortDescription: "Phòng đặc biệt có bồn tắm ngâm mình thư giãn cạnh khung cửa sổ đón hoàng hôn lãng mạn.",
    description: "Một trong những căn phòng được yêu thích nhất tại M_Dalats Boutique Villa. Bồn tắm đá mài tinh xảo đặt cạnh cửa sổ kính cho phép bạn ngâm mình trong làn nước ấm cùng muối thảo mộc ngắm thông reo.",
    amenities: JSON.stringify([
      "Bồn tắm thư giãn cao cấp",
      "Muối tắm & tinh dầu tự nhiên",
      "Giường King size siêu êm",
      "Smart TV 4K",
      "Minibar đầy đủ nước giải khát",
      "Áo choàng tắm & khăn tắm cao cấp"
    ]),
    isAvailable: true,
  },
  {
    slug: "la-em-105",
    name: "M_Dalats 105",
    roomNumber: "105",
    area: 25,
    maxAdults: 2,
    maxChildren: 2,
    bedType: "1 Giường King",
    viewType: "Góc phố Đà Lạt xưa & vườn hoa",
    pricePerNight: 1250000,
    originalPrice: 1450000,
    image: "/images/DH_01539-HDR-Edit-700x466.jpg",
    gallery: JSON.stringify([
      "/images/DH_01539-HDR-Edit-700x466.jpg",
      "/images/DH_02032-HDR-Edit-700x466.jpg"
    ]),
    shortDescription: "Không gian khoáng đạt, thiết kế mở chan hòa nắng ấm, bồn tắm cao cấp cho kỳ nghỉ ngọt ngào.",
    description: "M_Dalats 105 mang hơi thở kiến trúc xứ Tuscany với tường vôi mộc, gạch đất nung và chi tiết sắt uốn mỹ nghệ. Sự pha trộn giữa vẻ đẹp cổ xưa và tiện nghi hiện đại mang đến cảm xúc khó quên.",
    amenities: JSON.stringify([
      "Bồn tắm nằm sang trọng",
      "Kính tràn viền ngắm cảnh",
      "Giường King bọc nệm lông vũ",
      "Két sắt điện tử",
      "Bộ đồ pha trà thủ công"
    ]),
    isAvailable: true,
  },
  {
    slug: "la-em-201",
    name: "M_Dalats 201",
    roomNumber: "201",
    area: 35,
    maxAdults: 2,
    maxChildren: 2,
    bedType: "1 Giường King + Sofa Bed",
    viewType: "Toàn cảnh thành phố thung lũng & nhà lồng",
    pricePerNight: 1650000,
    originalPrice: 1950000,
    image: "/images/DH_02032-HDR-Edit-700x466.jpg",
    gallery: JSON.stringify([
      "/images/DH_02032-HDR-Edit-700x466.jpg",
      "/images/DH_02020-HDR-Edit-700x466.jpg"
    ]),
    shortDescription: "Phòng Penthouse Suite áp mái cao cấp nhất villa, diện tích 35m2 với trần kính ngắm sao đêm.",
    description: "M_Dalats 201 là kiệt tác nghỉ dưỡng tại tầng áp mái. Vào ban đêm, bạn có thể chiêm ngưỡng kinh đô ánh sáng của các thung lũng nhà lồng lung linh dưới chân dốc từ chính chiếc giường của mình.",
    amenities: JSON.stringify([
      "Không gian Suite 35m2",
      "Khu tiếp khách riêng biệt",
      "Cửa sổ áp mái ngắm sao",
      "Bồn tắm ngâm thảo dược",
      "Bàn làm việc view đồi thông",
      "Loa bluetooth cổ điển",
      "Rượu vang & trái cây chào đón"
    ]),
    isAvailable: true,
  },
  {
    slug: "la-em-202",
    name: "M_Dalats 202",
    roomNumber: "202",
    area: 25,
    maxAdults: 2,
    maxChildren: 2,
    bedType: "1 Giường King",
    viewType: "Thung lũng thông & sương mờ",
    pricePerNight: 1200000,
    originalPrice: 1400000,
    image: "/images/DH_02020-HDR-Edit-700x466.jpg",
    gallery: JSON.stringify([
      "/images/DH_02020-HDR-Edit-700x466.jpg",
      "/images/DH_01610-HDR-Edit-700x466.jpg"
    ]),
    shortDescription: "Căn phòng áp mái gỗ mộc ấm áp, mái dốc độc đáo như truyện cổ tích giữa lòng Đà Lạt.",
    description: "Thiết kế trần gỗ thông tự nhiên tỏa hương thơm dìu dịu. M_Dalats 202 tạo nên cảm giác bình an lạ kỳ, nơi bạn được cuộn mình trong chăn ấm, nhâm nhi một cuốn sách hay và lắng nghe giọt mưa rả rích.",
    amenities: JSON.stringify([
      "Trần ốp gỗ thông tự nhiên",
      "Nội thất gỗ mộc thủ công",
      "Giường King êm ái",
      "Phòng tắm đứng hiện đại",
      "Trà sen & mứt Đà Lạt miễn phí"
    ]),
    isAvailable: true,
  },
  {
    slug: "la-em-203",
    name: "M_Dalats 203",
    roomNumber: "203",
    area: 30,
    maxAdults: 2,
    maxChildren: 2,
    bedType: "1 Giường King",
    viewType: "Rừng thông & đỉnh Langbiang xa xa",
    pricePerNight: 1450000,
    originalPrice: 1650000,
    image: "/images/DH_01610-HDR-Edit-700x466.jpg",
    gallery: JSON.stringify([
      "/images/DH_01610-HDR-Edit-700x466.jpg",
      "/images/DH_01759-HDR-700x466.jpg"
    ]),
    shortDescription: "Phòng Suite tầng mái rộng 30m2 với ban công ngắm trọn biển mây sớm và hoàng hôn rực rỡ.",
    description: "Phòng M_Dalats 203 mở ra góc nhìn rộng lớn về phía rừng thông nguyên sinh. Một tách cà phê nóng vào sớm tinh mơ trên ban công M_Dalats 203 sẽ là trải nghiệm nhớ mãi trong chuyến đi của bạn.",
    amenities: JSON.stringify([
      "Ban công ngắm biển mây",
      "Giường ngủ King size cao cấp",
      "Khu vực sinh hoạt rộng",
      "Phòng tắm lát đá tự nhiên",
      "Đồ uống chào đón đặc biệt"
    ]),
    isAvailable: true,
  },
  {
    slug: "la-em-204",
    name: "M_Dalats 204",
    roomNumber: "204",
    area: 25,
    maxAdults: 2,
    maxChildren: 2,
    bedType: "1 Giường King",
    viewType: "Khu vườn trên cao & dốc hoa",
    pricePerNight: 1200000,
    originalPrice: 1400000,
    image: "/images/DH_01759-HDR-700x466.jpg",
    gallery: JSON.stringify([
      "/images/DH_01759-HDR-700x466.jpg",
      "/images/DH_02032-HDR-Edit-700x466.jpg"
    ]),
    shortDescription: "Căn phòng ngập tràn sắc màu ấm áp xứ Florence, góc cửa sổ thơ mộng nhìn xuống khu vườn xinh.",
    description: "Tone màu đất nung teracotta kết hợp ánh sáng ấm cúng đem đến cho M_Dalats 204 một sức hút khó cưỡng. Mọi tiện nghi được bố trí tiện lợi, tinh tế phục vụ cho kỳ nghỉ dưỡng trọn vẹn.",
    amenities: JSON.stringify([
      "Cửa sổ lớn ngắm hoàng hôn",
      "Giường King Size êm ái",
      "Tủ quần áo gỗ cổ điển",
      "Phòng tắm riêng biệt tiện nghi",
      "Wifi cáp quang tốc độ cao"
    ]),
    isAvailable: true,
  },
];

export async function seedRooms() {
  console.log("Checking rooms in database...");
  const existing = await db.select().from(rooms);
  if (existing.length === 0) {
    console.log(`Seeding ${initialRooms.length} rooms...`);
    for (const room of initialRooms) {
      await db.insert(rooms).values(room);
    }
    console.log("Rooms seeded successfully!");
  } else {
    for (const r of existing) {
      if (r.name.includes("Là Em") || r.description?.includes("Là Em")) {
        await db
          .update(rooms)
          .set({
            name: r.name.replace(/Là Em/g, "M_Dalats"),
            description: r.description ? r.description.replace(/Là Em/g, "M_Dalats") : r.description,
            shortDescription: r.shortDescription ? r.shortDescription.replace(/Là Em/g, "M_Dalats") : r.shortDescription,
          })
          .where(eq(rooms.id, r.id));
      }
    }
    console.log(`Rooms already seeded (${existing.length} rooms found).`);
  }
}
