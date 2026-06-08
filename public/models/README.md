This folder contains lightweight starter GLB files so the 3D showcase works immediately. Replace them with high-fidelity Judhoor product models using these exact names:

- past-box.glb
- balance-box.glb
- you-are-important-box.glb
- travel-box.glb

Model object naming assumptions:

- base
- lid
- inner_tray
- item_radio
- item_perfume
- item_coffee_cup
- item_cards
- item_booklet
- item_envelope
- item_pouch

For open-box support, the lid object must be named `lid`. Its pivot/origin should be at the back lower edge so rotating the lid on the X axis opens it like a real gift box. If the GLB includes an open/unbox/lid animation clip, the site will play that clip instead of rotating the `lid` object directly.
