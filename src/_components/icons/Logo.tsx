"use client";

import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link className="logo" href="/">
      <span className="logo-mark">
        <Image src="/images/logo.png" alt="The Cork Conclave" fill sizes="(max-width: 900px) 140px, 180px" priority />
      </span>
    </Link>
  );
}
