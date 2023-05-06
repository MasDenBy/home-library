using StronglyTypedIds;

[assembly: StronglyTypedIdDefaults(
    backingType: StronglyTypedIdBackingType.Int,
    converters: StronglyTypedIdConverter.SystemTextJson |
        StronglyTypedIdConverter.TypeConverter |
        StronglyTypedIdConverter.DapperTypeHandler)]

