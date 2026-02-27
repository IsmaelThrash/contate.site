/**
 * This file contains TypeScript definitions for PocketBase JavaScript migrations,
 * including operations with collections, records, and the $app instance.
 */

// -------------------------------------------------------------------
// Core App Interface (Transaction Context)
// -------------------------------------------------------------------

interface App {
	/**
	 * Find a collection by its name or ID
	 */
	findCollectionByNameOrId(nameOrId: string): Collection;

	/**
	 * Find an auth record by email
	 */
	findAuthRecordByEmail(collection: string, email: string): PBRecord;

	/**
	 * Save a model (Collection, Record, etc.) to the database
	 */
	save(model: Model): void;

	/**
	 * Save a model without validation
	 */
	saveNoValidate(model: Model): void;

	/**
	 * Delete a model from the database
	 */
	delete(model: Model): void;

	/**
	 * Get the app database instance for raw SQL queries
	 */
	db(): Database;

	/**
	 * Get app settings
	 */
	settings(): Settings;

	/**
	 * Save app settings
	 */
	save(settings: Settings): void;

	/**
	 * Execute raw SQL query
	 */
	newQuery(sql: string): Query;
}

// -------------------------------------------------------------------
// Collection Operations
// -------------------------------------------------------------------

interface Collection {
	/**
	 * 15 characters string to store as collection ID.
	 * If not set, it will be auto generated.
	 */
	id?: string;

	/**
	 * Unique collection name (used as a table name for the records table).
	 */
	name: string;

	/**
	 * Type of the collection.
	 * If not set, the collection type will be "base" by default.
	 */
	type?: "base" | "view" | "auth";

	/**
	 * List with the collection fields.
	 * This field is optional and autopopulated for "view" collections based on the viewQuery.
	 */
	fields?: Array<Field>;

	/**
	 * The collection indexes and unique constraints.
	 * Note that "view" collections don't support indexes.
	 */
	indexes?: Array<string>;

	/**
	 * Marks the collection as "system" to prevent being renamed, deleted or modify its API rules.
	 */
	system?: boolean;

	/**
	 * CRUD API rules
	 */
	listRule?: null | string;
	viewRule?: null | string;
	createRule?: null | string;
	updateRule?: null | string;
	deleteRule?: null | string;

	// -------------------------------------------------------
	// view options
	// -------------------------------------------------------

	/**
	 * Required for view collections
	 */
	viewQuery?: string;

	// -------------------------------------------------------
	// auth options
	// -------------------------------------------------------

	/**
	 * API rule that gives admin-like permissions to allow fully managing the auth record(s),
	 * e.g. changing the password without requiring to enter the old one, directly updating the
	 * verified state or email, etc. This rule is executed in addition to the createRule and updateRule.
	 */
	manageRule?: null | string;

	/**
	 * API rule that could be used to specify additional record constraints applied after record
	 * authentication and right before returning the auth token response to the client.
	 *
	 * For example, to allow only verified users you could set it to "verified = true".
	 *
	 * Set it to empty string to allow any Auth collection record to authenticate.
	 *
	 * Set it to null to disallow authentication altogether for the collection.
	 */
	authRule?: null | string;

	/**
	 * AuthAlert defines options related to the auth alerts on new device login.
	 */
	authAlert?: {
		enabled?: boolean;
		emailTemplate?: {
			subject: string;
			body: string;
		};
	};

	/**
	 * OAuth2 specifies whether OAuth2 auth is enabled for the collection
	 * and which OAuth2 providers are allowed.
	 */
	oauth2?: {
		enabled?: boolean;
		mappedFields?: {
			id?: string;
			name?: string;
			username?: string;
			avatarURL?: string;
		};
		providers?: Array<{
			name: string;
			clientId: string;
			clientSecret: string;
			authUrl?: string;
			tokenUrl?: string;
			userApiUrl?: string;
			displayName?: string;
			pkce?: null | boolean;
		}>;
	};

	/**
	 * PasswordAuth defines options related to the collection password authentication.
	 */
	passwordAuth?: {
		enabled?: boolean;
		identityFields: Array<string>;
	};

	/**
	 * MFA defines options related to the Multi-factor authentication (MFA).
	 */
	mfa?: {
		enabled?: boolean;
		duration: number;
		rule?: string;
	};

	/**
	 * OTP defines options related to the One-time password authentication (OTP).
	 */
	otp?: {
		enabled?: boolean;
		duration: number;
		length: number;
		emailTemplate?: {
			subject: string;
			body: string;
		};
	};

	/**
	 * Token configurations.
	 */
	authToken?: {
		duration: number;
		secret: string;
	};
	passwordResetToken?: {
		duration: number;
		secret: string;
	};
	emailChangeToken?: {
		duration: number;
		secret: string;
	};
	verificationToken?: {
		duration: number;
		secret: string;
	};
	fileToken?: {
		duration: number;
		secret: string;
	};

	/**
	 * Default email templates.
	 */
	verificationTemplate?: {
		subject: string;
		body: string;
	};
	resetPasswordTemplate?: {
		subject: string;
		body: string;
	};
	confirmEmailChangeTemplate?: {
		subject: string;
		body: string;
	};

	/**
	 * Add an index to the collection
	 */
	addIndex(
		name: string,
		unique: boolean,
		columnsExpr: string,
		optWhereExpr?: string
	): void;

	/**
	 * Remove an index from the collection
	 */
	removeIndex(name: string): void;
}

// -------------------------------------------------------------------
// Type Definitions
// -------------------------------------------------------------------

/**
 * DateTime represents a date-time value
 */
type DateTime = string | Date;

// -------------------------------------------------------------------
// Base Field Interface
// -------------------------------------------------------------------

/**
 * BaseField defines the common properties that all field types share
 */
interface BaseField {
	/**
	 * Name (required) is the unique name of the field.
	 */
	name: string
	/**
	 * Id is the unique stable field identifier.
	 * 
	 * It is automatically generated from the name when adding to a collection FieldsList.
	 */
	id: string
	/**
	 * System prevents the renaming and removal of the field.
	 */
	system: boolean
	/**
	 * Hidden hides the field from the API response.
	 */
	hidden: boolean
	/**
	 * Presentable hints the Dashboard UI to use the underlying
	 * field record value in the relation preview label.
	 */
	presentable: boolean
	/**
	 * Required will require the field value to be non-empty/non-zero.
	 */
	required: boolean
}

// -------------------------------------------------------------------
// Field Type Definitions
// -------------------------------------------------------------------

/**
  * AutodateField defines an "autodate" type field, aka.
  * field which datetime value could be auto set on record create/update.
  * 
  * This field is usually used for defining timestamp fields like "created" and "updated".
  * 
  * Requires either both or at least one of the OnCreate or OnUpdate options to be set.
  */
interface AutodateField extends BaseField {
	/**
	 * OnCreate auto sets the current datetime as field value on record create.
	 */
	onCreate: boolean
	/**
	 * OnUpdate auto sets the current datetime as field value on record update.
	 */
	onUpdate: boolean
}

/**
 * BoolField defines "bool" type field to store a single true/false value.
 * 
 * The respective zero record field value is false.
 */
interface BoolField extends BaseField {
	// BoolField has no additional properties beyond BaseField
	// The required property from BaseField will require the field value to be always "true"
}

/**
 * DateField defines "date" type field to store a single [types.DateTime] value.
 * 
 * The respective zero record field value is the zero [types.DateTime].
 */
interface DateField extends BaseField {
	/**
	 * Min specifies the min allowed field value.
	 * 
	 * Leave it empty to skip the validator.
	 */
	min: DateTime
	/**
	 * Max specifies the max allowed field value.
	 * 
	 * Leave it empty to skip the validator.
	 */
	max: DateTime
}
/**
 * EditorField defines "editor" type field to store HTML formatted text.
 * 
 * The respective zero record field value is empty string.
 */
interface EditorField extends BaseField {
	/**
	 * MaxSize specifies the maximum size of the allowed field value (in bytes and up to 2^53-1).
	 * 
	 * If zero, a default limit of ~5MB is applied.
	 */
	maxSize: number
	/**
	 * ConvertURLs is usually used to instruct the editor whether to
	 * apply url conversion (eg. stripping the domain name in case the
	 * urls are using the same domain as the one where the editor is loaded).
	 * 
	 * (see also https://www.tiny.cloud/docs/tinymce/6/url-handling/#convert_urls)
	 */
	convertURLs: boolean
}
/**
 * EmailField defines "email" type field for storing a single email string address.
 * 
 * The respective zero record field value is empty string.
 */
interface EmailField extends BaseField {
	/**
	 * ExceptDomains will require the email domain to NOT be included in the listed ones.
	 * 
	 * This validator can be set only if OnlyDomains is empty.
	 */
	exceptDomains: Array<string>
	/**
	 * OnlyDomains will require the email domain to be included in the listed ones.
	 * 
	 * This validator can be set only if ExceptDomains is empty.
	 */
	onlyDomains: Array<string>
}

/**
 * FileField defines "file" type field for managing record file(s).
 * 
 * Only the file name is stored as part of the record value.
 * New files (aka. files to upload) are expected to be of *filesytem.File.
 * 
 * If MaxSelect is not set or <= 1, then the field value is expected to be a single record id.
 * 
 * If MaxSelect is > 1, then the field value is expected to be a slice of record ids.
 * 
 * The respective zero record field value is either empty string (single) or empty string slice (multiple).
 * 
 * ---
 * 
 * The following additional setter keys are available:
 * 
 * ```
 *   - "fieldName+" - append one or more files to the existing record one. For example:
 * 
 *     // []string{"old1.txt", "old2.txt", "new1_ajkvass.txt", "new2_klhfnwd.txt"}
 *     record.Set("documents+", []*filesystem.File{new1, new2})
 * 
 *   - "+fieldName" - prepend one or more files to the existing record one. For example:
 * 
 *     // []string{"new1_ajkvass.txt", "new2_klhfnwd.txt", "old1.txt", "old2.txt",}
 *     record.Set("+documents", []*filesystem.File{new1, new2})
 * 
 *   - "fieldName-" - subtract/delete one or more files from the existing record one. For example:
 * 
 *     // []string{"old2.txt",}
 *     record.Set("documents-", "old1.txt")
 * ```
 */
interface FileField extends BaseField {
	/**
	 * MaxSize specifies the maximum size of a single uploaded file (in bytes and up to 2^53-1).
	 * 
	 * If zero, a default limit of 5MB is applied.
	 */
	maxSize: number
	/**
	 * MaxSelect specifies the max allowed files.
	 * 
	 * For multiple files the value must be > 1, otherwise fallbacks to single (default).
	 */
	maxSelect: number
	/**
	 * MimeTypes specifies an optional list of the allowed file mime types.
	 * 
	 * Leave it empty to disable the validator.
	 */
	mimeTypes: Array<string>
	/**
	 * Thumbs specifies an optional list of the supported thumbs for image based files.
	 * 
	 * Each entry must be in one of the following formats:
	 * 
	 * ```
	 *   - WxH  (eg. 100x300) - crop to WxH viewbox (from center)
	 *   - WxHt (eg. 100x300t) - crop to WxH viewbox (from top)
	 *   - WxHb (eg. 100x300b) - crop to WxH viewbox (from bottom)
	 *   - WxHf (eg. 100x300f) - fit inside a WxH viewbox (without cropping)
	 *   - 0xH  (eg. 0x300)    - resize to H height preserving the aspect ratio
	 *   - Wx0  (eg. 100x0)    - resize to W width preserving the aspect ratio
	 * ```
	 */
	thumbs: Array<string>
	/**
	 * Protected will require the users to provide a special file token to access the file.
	 * 
	 * Note that by default all files are publicly accessible.
	 * 
	 * For the majority of the cases this is fine because by default
	 * all file names have random part appended to their name which
	 * need to be known by the user before accessing the file.
	 */
	protected: boolean
}
/**
 * GeoPointField defines "geoPoint" type field for storing latitude and longitude GPS coordinates.
 * 
 * You can set the record field value as [types.GeoPoint], map or serialized json object with lat-lon props.
 * The stored value is always converted to [types.GeoPoint].
 * Nil, empty map, empty bytes slice, etc. results in zero [types.GeoPoint].
 * 
 * Examples of updating a record's GeoPointField value programmatically:
 * 
 * ```
 * 	record.Set("location", types.GeoPoint{Lat: 123, Lon: 456})
 * 	record.Set("location", map[string]any{"lat":123, "lon":456})
 * 	record.Set("location", []byte(`{"lat":123, "lon":456}`)
 * ```
 */
interface GeoPointField extends BaseField {
	// GeoPointField has no additional properties beyond BaseField
	// The required property from BaseField will require the field coordinates to be non-zero (aka. not "Null Island")
}
/**
 * JSONField defines "json" type field for storing any serialized JSON value.
 * 
 * The respective zero record field value is the zero [types.JSONRaw].
 */
interface JSONField extends BaseField {
	/**
	 * MaxSize specifies the maximum size of the allowed field value (in bytes and up to 2^53-1).
	 * 
	 * If zero, a default limit of 1MB is applied.
	 */
	maxSize: number
}
/**
 * NumberField defines "number" type field for storing numeric (float64) value.
 * 
 * The respective zero record field value is 0.
 * 
 * The following additional setter keys are available:
 * 
 * ```
 *   - "fieldName+" - appends to the existing record value. For example:
 *     record.Set("total+", 5)
 *   - "fieldName-" - subtracts from the existing record value. For example:
 *     record.Set("total-", 5)
 * ```
 */
interface NumberField extends BaseField {
	/**
	 * Min specifies the min allowed field value.
	 * 
	 * Leave it nil to skip the validator.
	 */
	min?: number
	/**
	 * Max specifies the max allowed field value.
	 * 
	 * Leave it nil to skip the validator.
	 */
	max?: number
	/**
	 * OnlyInt will require the field value to be integer.
	 */
	onlyInt: boolean
}
/**
 * PasswordField defines "password" type field for storing bcrypt hashed strings
 * (usually used only internally for the "password" auth collection system field).
 * 
 * If you want to set a direct bcrypt hash as record field value you can use the SetRaw method, for example:
 * 
 * ```
 * 	// generates a bcrypt hash of "123456" and set it as field value
 * 	// (record.GetString("password") returns the plain password until persisted, otherwise empty string)
 * 	record.Set("password", "123456")
 * 
 * 	// set directly a bcrypt hash of "123456" as field value
 * 	// (record.GetString("password") returns empty string)
 * 	record.SetRaw("password", "$2a$10$.5Elh8fgxypNUWhpUUr/xOa2sZm0VIaE0qWuGGl9otUfobb46T1Pq")
 * ```
 * 
 * The following additional getter keys are available:
 * 
 * ```
 *   - "fieldName:hash" - returns the bcrypt hash string of the record field value (if any). For example:
 *     record.GetString("password:hash")
 * ```
 */
interface PasswordField extends BaseField {
	/**
	 * Pattern specifies an optional regex pattern to match against the field value.
	 * 
	 * Leave it empty to skip the pattern check.
	 */
	pattern: string
	/**
	 * Min specifies an optional required field string length.
	 */
	min: number
	/**
	 * Max specifies an optional required field string length.
	 * 
	 * If zero, fallback to max 71 bytes.
	 */
	max: number
	/**
	 * Cost specifies the cost/weight/iteration/etc. bcrypt factor.
	 * 
	 * If zero, fallback to [bcrypt.DefaultCost].
	 * 
	 * If explicitly set, must be between [bcrypt.MinCost] and [bcrypt.MaxCost].
	 */
	cost: number
}
/**
 * RelationField defines "relation" type field for storing single or
 * multiple collection record references.
 * 
 * Requires the CollectionId option to be set.
 * 
 * If MaxSelect is not set or <= 1, then the field value is expected to be a single record id.
 * 
 * If MaxSelect is > 1, then the field value is expected to be a slice of record ids.
 * 
 * The respective zero record field value is either empty string (single) or empty string slice (multiple).
 * 
 * ---
 * 
 * The following additional setter keys are available:
 * 
 * ```
 *   - "fieldName+" - append one or more values to the existing record one. For example:
 * 
 *     record.Set("categories+", []string{"new1", "new2"}) // []string{"old1", "old2", "new1", "new2"}
 * 
 *   - "+fieldName" - prepend one or more values to the existing record one. For example:
 * 
 *     record.Set("+categories", []string{"new1", "new2"}) // []string{"new1", "new2", "old1", "old2"}
 * 
 *   - "fieldName-" - subtract one or more values from the existing record one. For example:
 * 
 *     record.Set("categories-", "old1") // []string{"old2"}
 * ```
 */
interface RelationField extends BaseField {
	/**
	 * CollectionId is the id of the related collection.
	 */
	collectionId: string
	/**
	 * CascadeDelete indicates whether the root model should be deleted
	 * in case of delete of all linked relations.
	 */
	cascadeDelete: boolean
	/**
	 * MinSelect indicates the min number of allowed relation records
	 * that could be linked to the main model.
	 * 
	 * No min limit is applied if it is zero or negative value.
	 */
	minSelect: number
	/**
	 * MaxSelect indicates the max number of allowed relation records
	 * that could be linked to the main model.
	 * 
	 * For multiple select the value must be > 1, otherwise fallbacks to single (default).
	 * 
	 * If MinSelect is set, MaxSelect must be at least >= MinSelect.
	 */
	maxSelect: number
}
/**
 * SelectField defines "select" type field for storing single or
 * multiple string values from a predefined list.
 * 
 * Requires the Values option to be set.
 * 
 * If MaxSelect is not set or <= 1, then the field value is expected to be a single Values element.
 * 
 * If MaxSelect is > 1, then the field value is expected to be a subset of Values slice.
 * 
 * The respective zero record field value is either empty string (single) or empty string slice (multiple).
 * 
 * ---
 * 
 * The following additional setter keys are available:
 * 
 * ```
 *   - "fieldName+" - append one or more values to the existing record one. For example:
 * 
 *     record.Set("roles+", []string{"new1", "new2"}) // []string{"old1", "old2", "new1", "new2"}
 * 
 *   - "+fieldName" - prepend one or more values to the existing record one. For example:
 * 
 *     record.Set("+roles", []string{"new1", "new2"}) // []string{"new1", "new2", "old1", "old2"}
 * 
 *   - "fieldName-" - subtract one or more values from the existing record one. For example:
 * 
 *     record.Set("roles-", "old1") // []string{"old2"}
 * ```
 */
interface SelectField extends BaseField {
	/**
	 * Values specifies the list of accepted values.
	 */
	values: Array<string>
	/**
	 * MaxSelect specifies the max allowed selected values.
	 * 
	 * For multiple select the value must be > 1, otherwise fallbacks to single (default).
	 */
	maxSelect: number
}
/**
 * TextField defines "text" type field for storing any string value.
 * 
 * The respective zero record field value is empty string.
 * 
 * The following additional setter keys are available:
 * 
 * - "fieldName:autogenerate" - autogenerate field value if AutogeneratePattern is set. For example:
 * 
 * ```
 * 	record.Set("slug:autogenerate", "") // [random value]
 * 	record.Set("slug:autogenerate", "abc-") // abc-[random value]
 * ```
 */
interface TextField extends BaseField {
	/**
	 * Min specifies the minimum required string characters.
	 * 
	 * if zero value, no min limit is applied.
	 */
	min: number
	/**
	 * Max specifies the maximum allowed string characters.
	 * 
	 * If zero, a default limit of 5000 is applied.
	 */
	max: number
	/**
	 * Pattern specifies an optional regex pattern to match against the field value.
	 * 
	 * Leave it empty to skip the pattern check.
	 */
	pattern: string
	/**
	 * AutogeneratePattern specifies an optional regex pattern that could
	 * be used to generate random string from it and set it automatically
	 * on record create if no explicit value is set or when the `:autogenerate` modifier is used.
	 * 
	 * Note: the generated value still needs to satisfy min, max, pattern (if set)
	 */
	autogeneratePattern: string
	/**
	 * PrimaryKey will mark the field as primary key.
	 * 
	 * A single collection can have only 1 field marked as primary key.
	 */
	primaryKey: boolean
}
/**
 * URLField defines "url" type field for storing a single URL string value.
 * 
 * The respective zero record field value is empty string.
 */
interface URLField extends BaseField {
	/**
	 * ExceptDomains will require the URL domain to NOT be included in the listed ones.
	 * 
	 * This validator can be set only if OnlyDomains is empty.
	 */
	exceptDomains: Array<string>
	/**
	 * OnlyDomains will require the URL domain to be included in the listed ones.
	 * 
	 * This validator can be set only if ExceptDomains is empty.
	 */
	onlyDomains: Array<string>
}

/**
 * Collection field definition
 */
interface Field {
	[key: string]: any;
}

interface FieldsList extends Array<Field> {
	/**
	 * GetByName returns a single field by its name.
	 */
	getByName(fieldName: string): Field

	/**
	 * RemoveByName removes a single field by its name.
	 * 
	 * This method does nothing if field with the specified name doesn't exist.
	 */
	removeByName(fieldName: string): void

	/**
* Add adds one or more fields to the current list.
* 
* By default this method will try to REPLACE existing fields with
* the new ones by their id or by their name if the new field doesn't have an explicit id.
* 
* If no matching existing field is found, it will APPEND the field to the end of the list.
* 
* In all cases, if any of the new fields don't have an explicit id it will auto generate a default one for them
* (the id value doesn't really matter and it is mostly used as a stable identifier in case of a field rename).
*/
	add(...fields: Field[]): void

	/**
	 * AddAt is the same as Add but insert/move the fields at the specific position.
	 * 
	 * If pos < 0, then this method acts the same as calling Add.
	 * 
	 * If pos > FieldsList total items, then the specified fields are inserted/moved at the end of the list.
	 */
	addAt(pos: number, ...fields: Field[]): void
}

// -------------------------------------------------------------------
// Record Operations
// -------------------------------------------------------------------

interface PBRecord {
	/**
	 * Record ID
	 */
	id?: string;

	/**
	 * Record data
	 */
	[key: string]: any;

	/**
	 * Set a field value
	 */
	set(field: string, value: any): void;

	/**
	 * Get a field value
	 */
	get(field: string): any;

	/**
	 * Check if field exists
	 */
	has(field: string): boolean;

	/**
	 * Remove a field
	 */
	remove(field: string): void;

	/**
	 * Get all field names
	 */
	keys(): string[];

	/**
	 * Get all field values
	 */
	values(): any[];

	/**
	 * Get record as object
	 */
	export(): { [key: string]: any };

	/**
	 * Import data into record
	 */
	import(data: { [key: string]: any }): void;

	/**
	 * Refresh record from database
	 */
	refresh(): void;

	/**
	 * Get collection this record belongs to
	 */
	collection(): Collection;
}

// -------------------------------------------------------------------
// Database Operations
// -------------------------------------------------------------------

interface Database {
	/**
	 * Create a new query
	 */
	newQuery(sql: string): Query;

	/**
	 * Execute a query
	 */
	execute(): any;
}

interface Query {
	/**
	 * Execute the query
	 */
	execute(): any;

	/**
	 * Bind parameters to the query
	 */
	bind(...params: any[]): Query;
}

// -------------------------------------------------------------------
// Settings
// -------------------------------------------------------------------

interface Settings {
	/**
	 * App metadata
	 */
	meta: {
		appName: string;
		appURL: string;
	};
}

// -------------------------------------------------------------------
// Model defines an interface with common methods that all db models should have.
// -------------------------------------------------------------------
interface Model {
	[key: string]: any;
	tableName(): string;
	pk(): any;
	lastSavedPK(): any;
	isNew(): boolean;
	markAsNew(): void;
	markAsNotNew(): void;
}
