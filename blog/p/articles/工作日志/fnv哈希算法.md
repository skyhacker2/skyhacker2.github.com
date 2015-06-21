#FNV哈希算法

说明：[http://blog.csdn.net/hustfoxy/article/details/23687239](http://blog.csdn.net/hustfoxy/article/details/23687239)

代码来自《游戏编程精粹5》（基于组件的对象管理）

```
#ifndef __CHASH_H
#define __CHASH_H

#include "types.h"

class CHash
{
public:
	CHash();
	CHash(uint32 hashValue);
	CHash(const char *pString);
	CHash(const CHash &rhs);
	CHash &operator=(const CHash &rhs);

	void Set(const uint32 hash);

	bool IsValid() const;
	operator unsigned int()			{ return mHashValue; }

	const bool operator<(const CHash &rhs) const;
	const bool operator>(const CHash &rhs) const;
	const bool operator<=(const CHash &rhs) const;
	const bool operator>=(const CHash &rhs) const;
	const bool operator==(const CHash &rhs) const;
	const bool operator!=(const CHash &rhs) const;
private:
	uint32 MakeHash(const char *pString);

	uint32 mHashValue;
};
#endif //__CHASH_H
```

```
#include "CHash.h"

#define INVALID_HASH 0xffffffff
#define HASH_INIT	0x811c9dc5
#define HASH_PRIME	0x01000193
#define CONVERT_BACKSLASH
#define CASE_INSENSITIVE

CHash::CHash() : mHashValue(INVALID_HASH)
{
}

CHash::CHash(uint32 hashValue) : mHashValue(hashValue)
{
}

CHash::CHash(const CHash &rhs) : mHashValue(rhs.mHashValue)
{

}

CHash::CHash(const char *pString)
{
	mHashValue = MakeHash(pString);
}

CHash &CHash::operator=(const CHash &rhs)
{
	if (&rhs != this)
	{
		mHashValue = rhs.mHashValue;
	}
	return *this;
}

bool CHash::IsValid() const
{
	return (mHashValue != INVALID_HASH);
}

uint32 CHash::MakeHash(const char *hashString)
{
	if (!hashString || !hashString[0])
		return INVALID_HASH;

	const unsigned char* string = (const unsigned char*)hashString;
	uint32 hash = HASH_INIT;

	while (*string)
	{
		hash *= HASH_PRIME;

		char c = *string++;

#ifdef CONVERT_BACKSLASH
		if (c == '\\')
		{
			c = '/';
		}
#endif



#ifdef CASE_INSENSITIVE
		if ((c >= 'a') && (c <= 'z'))
		{
			c -= 'a' - 'A';
		}
#endif
		hash ^= (uint32)c;
	}
	return hash;
}

void CHash::Set(const uint32 hash)
{
	mHashValue = hash;
}

const bool CHash::operator<(const CHash &rhs) const
{
	return mHashValue < rhs.mHashValue;
}

const bool CHash::operator>(const CHash &rhs) const
{
	return mHashValue > rhs.mHashValue;
}

const bool CHash::operator<=(const CHash &rhs) const
{
	return mHashValue <= rhs.mHashValue;
}

const bool CHash::operator>=(const CHash &rhs) const
{
	return mHashValue >= rhs.mHashValue;
}

const bool CHash::operator==(const CHash &rhs) const
{
	return mHashValue == rhs.mHashValue;
}

const bool CHash::operator!=(const CHash &rhs) const
{
	return (!(*this == rhs));
}
```