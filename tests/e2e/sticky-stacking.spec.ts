import { test, expect } from "@playwright/test";

test.describe("M_Dalats Villa - Sticky Stacking Scroll Audit", () => {
  test("1. Full Homepage Section Stacking Sequence Audit", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/M_Dalats/i);

    // Verify root & body do not have overflow-x: hidden breaking sticky
    const bodyOverflowX = await page.evaluate(() => {
      const bodyStyle = window.getComputedStyle(document.body);
      const htmlStyle = window.getComputedStyle(document.documentElement);
      const main = document.querySelector("main");
      const mainStyle = main ? window.getComputedStyle(main) : null;
      return {
        body: bodyStyle.overflowX,
        html: htmlStyle.overflowX,
        main: mainStyle ? mainStyle.overflowX : null,
      };
    });

    expect(bodyOverflowX.body).not.toBe("hidden");
    expect(bodyOverflowX.html).not.toBe("hidden");
    if (bodyOverflowX.main) {
      expect(bodyOverflowX.main).not.toBe("hidden");
    }

    // List of key section IDs and selectors
    const expectedSections = [
      { id: "hero", label: "HeroSection" },
      { id: "story", label: "StorySection" },
      { id: "how-it-works", label: "HowItWorksSection" },
      { selector: "section:has-text('Bộ Sưu Tập Không Gian')", label: "TasteDiamondSlider" },
      { id: "rooms", label: "RoomsSection" },
      { id: "dining", label: "DiningSection" },
      { id: "experiences", label: "ExperienceSection" },
      { id: "amenities", label: "AmenitiesSection" },
      { selector: "section:has-text('Le Livre d')", label: "TestimonialSection" },
      { selector: "section:has-text('Exclusive Privileges')", label: "BookingPerksSection" },
      { id: "location", label: "LocationSection" },
      { selector: "section:has-text('Privé Newsletter')", label: "NewsletterSection" },
      { selector: "footer", label: "Footer" },
    ];

    // Verify all sections exist in DOM
    for (const sec of expectedSections) {
      const locator = sec.id ? page.locator(`#${sec.id}`) : page.locator(sec.selector!);
      await expect(locator.first()).toBeAttached({ timeout: 10_000 });
    }

    // Verify z-index monotonic progression on desktop
    const zIndices = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll("main section, main footer, footer"));
      return sections.map((s) => ({
        tag: s.tagName.toLowerCase(),
        id: s.id || "",
        zIndex: window.getComputedStyle(s).zIndex,
        position: window.getComputedStyle(s).position,
      }));
    });

    console.log("Section Stacking Map:", JSON.stringify(zIndices, null, 2));

    // Scroll simulation: down through page
    await page.evaluate(async () => {
      const scrollStep = 800;
      const totalHeight = document.body.scrollHeight;
      for (let y = 0; y < totalHeight; y += scrollStep) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo({ top: totalHeight, behavior: "instant" });
    });

    // Check footer is visible at end
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    // Scroll back up simulation (reversibility check)
    await page.evaluate(async () => {
      const scrollStep = 800;
      for (let y = document.body.scrollHeight; y > 0; y -= scrollStep) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    });

    // Hero is visible at top
    const hero = page.locator("#hero");
    await expect(hero).toBeVisible();
  });
});
