define(["scripts/upfront/cache/storage-stub","scripts/upfront/cache/storage-memory","scripts/upfront/cache/storage-persistent","scripts/upfront/cache/storage-permanent"],function(e,t,r,s){var a=e;switch(((Upfront||{}).mainData||{}).response_cache_level){case"memory":a=t;break;case"persistent":a=r;break;case"permanent":a=s;break;default:a=e}return a.is_listening()||a.listen(),a});