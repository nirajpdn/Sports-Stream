import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import posthog from "~/utils/posthog.server";
import { useState, useEffect, useMemo } from "react";
import moment from "moment-timezone";
import { getStream } from "~/utils/getStream";
import CupLottie from "~/lottie/cup.json";
import SoccorLottie from "~/lottie/soccor.json";
import {
  Badge,
  Box,
  chakra,
  Circle,
  Flex,
  Heading,
  Icon,
  List,
  ListIcon,
  ListItem,
  Stack,
  Tag,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import type { IconProps } from "@chakra-ui/icon";
import Button from "~/components/Button";
import Player from "~/components/Player";
import ClientLottie from "~/components/ClientLottie";
import { TimeIcon } from "@chakra-ui/icons";
import { keyframes } from "@chakra-ui/react";

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(229, 62, 62, 0.6); }
  70% { box-shadow: 0 0 0 8px rgba(229, 62, 62, 0); }
  100% { box-shadow: 0 0 0 0 rgba(229, 62, 62, 0); }
`;
const pulseAnimation = `${pulse} 1.4s ease-out infinite`;

export const loader: LoaderFunction = async ({ request }) => {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "anonymous";
  const distinctId = `ip:${ip}`;

  posthog.capture({
    distinctId,
    event: "sports_page_viewed",
    properties: {
      $current_url: request.url,
    },
  });

  const response = await getStream();
  return json({ sports: response.data, days: response.days });
};

const ChakraBtn = chakra(Button);

const langColorMap: Record<string, string> = {
  EN: "blue",
  FR: "purple",
  ES: "orange",
  DE: "teal",
  IT: "pink",
  PT: "green",
  AR: "red",
};

const LIVE_WINDOW_HOURS = 2;

export default function Index() {
  const { colorMode } = useColorMode();
  const { sports, days } = useLoaderData();
  const [filterParams, setFilterParams] = useState<string>("all");
  const [sport, setSport] = useState<SportInterface>({} as SportInterface);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Client-only London time — avoids SSR hydration mismatch
  const [nowLondon, setNowLondon] = useState<moment.Moment | null>(null);
  const [localZoneLabel, setLocalZoneLabel] = useState<string>("");
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const countryCode = moment.tz
      .countries()
      .find((code) => moment.tz.zonesForCountry(code).includes(tz));
    const label = countryCode
      ? new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode) ??
        countryCode
      : tz.split("/").pop()?.replace(/_/g, " ") ?? "";
    setLocalZoneLabel(label);
    const tick = () => setNowLondon(moment.tz(new Date(), "Europe/London"));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const todayDay = useMemo(
    () => nowLondon?.format("dddd").toUpperCase() ?? "",
    [nowLondon],
  );
  const tomorrowDay = useMemo(
    () => nowLondon?.clone().add(1, "day").format("dddd").toUpperCase() ?? "",
    [nowLondon],
  );

  const getDayLabel = (day: string): string => {
    if (day === todayDay) return "Today";
    if (day === tomorrowDay) return "Tomorrow";
    return day.charAt(0) + day.slice(1).toLowerCase();
  };

  const isLive = (s: SportInterface): boolean => {
    if (!nowLondon || s.day !== todayDay) return false;
    const [h, m] = s.time.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return false;
    const start = nowLondon
      .clone()
      .startOf("day")
      .add(h, "hours")
      .add(m, "minutes");
    const end = start.clone().add(LIVE_WINDOW_HOURS, "hours");
    return nowLondon.isBetween(start, end);
  };

  const DAY_NUM: Record<string, number> = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
  };

  const toLocalTime = (day: string, time: string): string => {
    if (!nowLondon) return "";
    const [h, m] = time.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return "";
    const targetDay = DAY_NUM[day];
    if (targetDay === undefined) return "";
    const diff = targetDay - nowLondon.day();
    const eventLondon = nowLondon
      .clone()
      .startOf("day")
      .add(diff, "days")
      .add(h, "hours")
      .add(m, "minutes");
    return eventLondon.local().format("HH:mm");
  };

  const subtitleColor = colorMode === "light" ? "gray.500" : "gray.400";
  const tagInactiveBg = colorMode === "light" ? "gray.100" : "whiteAlpha.100";
  const tagInactiveColor = colorMode === "light" ? "gray.700" : "gray.300";

  return (
    <>
      <Player isOpen={isOpen} onClose={onClose} sport={sport} />
      <Box>
        {/* Hero */}
        <Flex
          my={{ base: "3rem", md: "5rem" }}
          flexDir={{ base: "column-reverse", md: "row" }}
          align="center"
          gap="2rem"
        >
          <Box flex="1">
            <Heading
              fontFamily="Caveat"
              fontWeight="bold"
              textAlign={{ base: "center", md: "left" }}
              fontSize={{ base: "2.8rem", md: "4rem" }}
              lineHeight="1.15"
            >
              Stream live sports,{" "}
              <Box as="span" color="primary">
                right here.
              </Box>
            </Heading>
            <Text
              mt="1rem"
              fontFamily="Caveat"
              fontSize={{ base: "1.1rem", md: "1.4rem" }}
              color={subtitleColor}
              textAlign={{ base: "center", md: "left" }}
            >
              Live events from around the world, updated every week.
            </Text>
            <Box mt="2.5rem" textAlign={{ base: "center", md: "left" }}>
              <Link to="#browse">
                <ChakraBtn
                  fontSize={{ base: "1.5rem", md: "2rem" }}
                  p={{ base: "0.5rem 3rem", md: "1rem 5rem" }}
                >
                  Browse Sports
                </ChakraBtn>
              </Link>
            </Box>
          </Box>
          <Box maxW="22rem">
            <ClientLottie animationData={CupLottie} />
          </Box>
        </Flex>

        {/* Browse section */}
        <Box id="browse">
          <Heading
            fontWeight="bold"
            fontFamily="Caveat"
            textAlign="center"
            fontSize={{ base: "2rem", md: "2.8rem" }}
          >
            This week&apos;s events
          </Heading>
          <Text
            fontFamily="Caveat"
            color={subtitleColor}
            fontSize="1.1rem"
            textAlign="center"
            mt="0.25rem"
          >
            Timezone: Europe/London
          </Text>

          {/* Day filter */}
          <Flex
            gap={{ base: "0.4rem", md: "0.75rem" }}
            mt="2rem"
            flexWrap="wrap"
            position="sticky"
            top="0"
            py="0.75rem"
            bg={useColorModeValue("light", "dark")}
            zIndex="10"
          >
            <Tag
              borderRadius="3rem"
              py={{ base: "0.3rem", md: "0.5rem" }}
              fontSize={{ base: "sm", md: "0.95rem" }}
              fontWeight="600"
              w="fit-content"
              cursor="pointer"
              px={{ base: "0.8rem", md: "1.5rem" }}
              bg={filterParams === "all" ? "primary" : tagInactiveBg}
              onClick={() => setFilterParams("all")}
              color={filterParams === "all" ? "white" : tagInactiveColor}
              transition="all 0.15s"
            >
              All
            </Tag>
            <Tag
              borderRadius="3rem"
              py={{ base: "0.3rem", md: "0.5rem" }}
              fontSize={{ base: "sm", md: "0.95rem" }}
              fontWeight="600"
              w="fit-content"
              cursor="pointer"
              px={{ base: "0.8rem", md: "1.5rem" }}
              bg={filterParams === "live" ? "red.500" : tagInactiveBg}
              onClick={() => setFilterParams("live")}
              color={filterParams === "live" ? "white" : "red.400"}
              transition="all 0.15s"
              gap="0.35rem"
            >
              <Box
                w="7px"
                h="7px"
                borderRadius="full"
                bg={filterParams === "live" ? "white" : "red.400"}
                animation={pulseAnimation}
                flexShrink={0}
              />
              Live
            </Tag>
            {days?.map((item: string, index: number) => (
              <Tag
                key={index}
                borderRadius="3rem"
                py={{ base: "0.3rem", md: "0.5rem" }}
                fontSize={{ base: "sm", md: "0.95rem" }}
                fontWeight="600"
                w="fit-content"
                px={{ base: "0.8rem", md: "1.5rem" }}
                cursor="pointer"
                color={filterParams === item ? "white" : tagInactiveColor}
                bg={filterParams === item ? "primary" : tagInactiveBg}
                onClick={() => setFilterParams(item)}
                transition="all 0.15s"
              >
                {getDayLabel(item)}
              </Tag>
            ))}
          </Flex>

          {/* Events list */}
          <Box mt="1.5rem" pb="3rem">
            {filterParams === "live"
              ? (() => {
                  const liveEvents = sports?.filter((s: SportInterface) =>
                    isLive(s),
                  );
                  return liveEvents?.length === 0 ? (
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      py="4rem"
                      gap="0.5rem"
                    >
                      <Box maxW="10rem" opacity={0.7}>
                        <ClientLottie animationData={SoccorLottie} />
                      </Box>
                      <Text
                        fontFamily="Caveat"
                        fontSize="1.4rem"
                        fontWeight="700"
                        color={colorMode === "light" ? "gray.700" : "gray.200"}
                      >
                        No live events right now
                      </Text>
                      <Text
                        fontFamily="Caveat"
                        fontSize="1rem"
                        color={subtitleColor}
                      >
                        Check back during scheduled match times.
                      </Text>
                    </Flex>
                  ) : (
                    <List spacing="0.6rem">
                      {liveEvents?.map(
                        (sport: SportInterface, index: number) => (
                          <ListItem
                            key={index}
                            borderWidth="1px"
                            borderRadius="10px"
                            px={{ base: "0.75rem", md: "1.1rem" }}
                            py={{ base: "0.65rem", md: "0.9rem" }}
                            bg={
                              colorMode === "light"
                                ? "red.50"
                                : "rgba(254,178,178,0.06)"
                            }
                            boxShadow="sm"
                            transition="all 0.18s ease"
                            onClick={() => {
                              onOpen();
                              setSport(sport);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                onOpen();
                                setSport(sport);
                              }
                            }}
                            _hover={{
                              borderColor: "primary",
                              borderLeftColor: "primary",
                              transform: "translateY(-2px)",
                              boxShadow: "md",
                            }}
                            _active={{ transform: "translateY(0)" }}
                            cursor="pointer"
                            role="button"
                            tabIndex={0}
                          >
                            <Flex
                              align="center"
                              justify="space-between"
                              gap="0.75rem"
                            >
                              <Flex
                                align="center"
                                gap="0.75rem"
                                minW={0}
                                flex="1"
                              >
                                <Circle
                                  size="2.2rem"
                                  bg="red.500"
                                  flexShrink={0}
                                  animation={pulseAnimation}
                                >
                                  <ListIcon
                                    m="0"
                                    fontSize="1rem"
                                    fill="white"
                                    color="white"
                                    as={PlayIcon}
                                  />
                                </Circle>
                                <Box minW={0} flex="1">
                                  <Flex
                                    align="center"
                                    gap="0.4rem"
                                    flexWrap="wrap"
                                  >
                                    <Text
                                      fontWeight="600"
                                      fontSize={{ base: "sm", md: "md" }}
                                      color={
                                        colorMode === "light"
                                          ? "gray.800"
                                          : "gray.100"
                                      }
                                      noOfLines={1}
                                    >
                                      {sport.title}
                                    </Text>
                                    <Badge
                                      colorScheme="red"
                                      variant="solid"
                                      borderRadius="3px"
                                      fontSize="0.6rem"
                                      px="0.4rem"
                                      letterSpacing="0.05em"
                                    >
                                      LIVE
                                    </Badge>
                                  </Flex>
                                  {sport?.lang && (
                                    <Badge
                                      mt="0.15rem"
                                      colorScheme={
                                        langColorMap[
                                          sport.lang.toUpperCase()
                                        ] ?? "gray"
                                      }
                                      borderRadius="3px"
                                      fontSize="0.65rem"
                                      px="0.4rem"
                                    >
                                      {sport.lang}
                                    </Badge>
                                  )}
                                </Box>
                              </Flex>
                              {(() => {
                                const local =
                                  toLocalTime(sport.day, sport.time) ||
                                  sport.time;
                                return (
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    borderRadius="full"
                                    px="0.75rem"
                                    py="0.2rem"
                                    gap="4px"
                                    fontSize="sm"
                                    fontWeight="600"
                                    whiteSpace="nowrap"
                                    flexShrink={0}
                                    bg={
                                      colorMode === "light"
                                        ? "red.100"
                                        : "rgba(254,178,178,0.15)"
                                    }
                                    color="red.500"
                                  >
                                    <TimeIcon boxSize="0.7rem" />
                                    <span>{local}</span>
                                    {localZoneLabel && (
                                      <Box
                                        as="span"
                                        fontWeight="400"
                                        color={subtitleColor}
                                      >
                                        / {localZoneLabel}
                                      </Box>
                                    )}
                                  </Stack>
                                );
                              })()}
                            </Flex>
                          </ListItem>
                        ),
                      )}
                    </List>
                  );
                })()
              : days
                  ?.filter((day: any) =>
                    filterParams === "all" ? true : filterParams === day,
                  )
                  ?.map((day: DayType, index: number) => (
                    <Box key={index} mb="2rem">
                      <Heading
                        mb="0.75rem"
                        fontFamily="Caveat"
                        fontSize="1.1rem"
                        fontWeight="700"
                        letterSpacing="0.08em"
                        textTransform="uppercase"
                        color={subtitleColor}
                      >
                        {getDayLabel(day)}
                      </Heading>
                      <List spacing="0.6rem">
                        {sports
                          ?.filter((sport: SportInterface) => sport.day === day)
                          ?.map((sport: SportInterface, index: number) => {
                            const live = isLive(sport);
                            return (
                              <ListItem
                                key={index}
                                borderWidth="1px"
                                borderRadius="10px"
                                px={{ base: "0.75rem", md: "1.1rem" }}
                                py={{ base: "0.65rem", md: "0.9rem" }}
                                bg={
                                  live
                                    ? colorMode === "light"
                                      ? "red.50"
                                      : "rgba(254,178,178,0.06)"
                                    : undefined
                                }
                                boxShadow="sm"
                                transition="all 0.18s ease"
                                onClick={() => {
                                  onOpen();
                                  setSport(sport);
                                }}
                                onKeyDown={(event) => {
                                  if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                  ) {
                                    event.preventDefault();
                                    onOpen();
                                    setSport(sport);
                                  }
                                }}
                                _hover={{
                                  borderColor: "primary",
                                  borderLeftColor: "primary",
                                  transform: "translateY(-2px)",
                                  boxShadow: "md",
                                }}
                                _active={{ transform: "translateY(0)" }}
                                cursor="pointer"
                                role="button"
                                tabIndex={0}
                              >
                                <Flex
                                  align="center"
                                  justify="space-between"
                                  gap="0.75rem"
                                >
                                  <Flex
                                    align="center"
                                    gap="0.75rem"
                                    minW={0}
                                    flex="1"
                                  >
                                    <Circle
                                      size="2.2rem"
                                      bg={live ? "red.500" : "primary"}
                                      flexShrink={0}
                                      animation={
                                        live ? pulseAnimation : undefined
                                      }
                                    >
                                      <ListIcon
                                        m="0"
                                        fontSize="1rem"
                                        fill="white"
                                        color="white"
                                        as={PlayIcon}
                                      />
                                    </Circle>
                                    <Box minW={0} flex="1">
                                      <Flex
                                        align="center"
                                        gap="0.4rem"
                                        flexWrap="wrap"
                                      >
                                        <Text
                                          fontWeight="600"
                                          fontSize={{ base: "sm", md: "md" }}
                                          color={
                                            colorMode === "light"
                                              ? "gray.800"
                                              : "gray.100"
                                          }
                                          noOfLines={1}
                                        >
                                          {sport.title}
                                        </Text>
                                        {live && (
                                          <Badge
                                            colorScheme="red"
                                            variant="solid"
                                            borderRadius="3px"
                                            fontSize="0.6rem"
                                            px="0.4rem"
                                            letterSpacing="0.05em"
                                          >
                                            LIVE
                                          </Badge>
                                        )}
                                      </Flex>
                                      {sport?.lang && (
                                        <Badge
                                          mt="0.15rem"
                                          colorScheme={
                                            langColorMap[
                                              sport.lang.toUpperCase()
                                            ] ?? "gray"
                                          }
                                          borderRadius="3px"
                                          fontSize="0.65rem"
                                          px="0.4rem"
                                        >
                                          {sport.lang}
                                        </Badge>
                                      )}
                                    </Box>
                                  </Flex>
                                  {(() => {
                                    const local =
                                      toLocalTime(sport.day, sport.time) ||
                                      sport.time;
                                    return (
                                      <Stack
                                        direction="row"
                                        alignItems="center"
                                        borderRadius="full"
                                        px="0.75rem"
                                        py="0.2rem"
                                        gap="4px"
                                        fontSize="sm"
                                        fontWeight="600"
                                        whiteSpace="nowrap"
                                        flexShrink={0}
                                        bg={
                                          live
                                            ? colorMode === "light"
                                              ? "red.100"
                                              : "rgba(254,178,178,0.15)"
                                            : colorMode === "light"
                                            ? "gray.100"
                                            : "whiteAlpha.150"
                                        }
                                        color={
                                          live
                                            ? "red.500"
                                            : colorMode === "light"
                                            ? "gray.600"
                                            : "gray.300"
                                        }
                                      >
                                        <TimeIcon boxSize="0.7rem" />
                                        <span>{local}</span>
                                        {localZoneLabel && (
                                          <Box
                                            as="span"
                                            fontWeight="400"
                                            color={subtitleColor}
                                          >
                                            / {localZoneLabel}
                                          </Box>
                                        )}
                                      </Stack>
                                    );
                                  })()}
                                </Flex>
                              </ListItem>
                            );
                          })}
                      </List>
                    </Box>
                  ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}

const PlayIcon: React.FC<IconProps> = (props) => (
  <Icon viewBox="0 0 122 89" fill="white" {...props}>
    <path d="M61.44,21.18c12.88,0,23.33,10.45,23.33,23.33c0,12.88-10.45,23.33-23.33,23.33S38.11,57.4,38.11,44.51 C38.11,31.63,48.55,21.18,61.44,21.18L61.44,21.18L61.44,21.18z M105.78,87.97c-0.54,0.63-1.28,0.97-2.04,1.03 c-0.77,0.06-1.58-0.18-2.23-0.72c-0.65-0.54-1-1.29-1.06-2.05l0-0.01c-0.05-0.77,0.18-1.57,0.72-2.22 c5.2-6.07,9.14-12.52,11.76-19.16c2.63-6.65,3.93-13.5,3.86-20.36c-0.05-6.79-1.45-13.62-4.22-20.33 c-2.71-6.54-6.73-12.97-12.11-19.12c-0.54-0.63-0.79-1.42-0.73-2.19c0.05-0.77,0.39-1.53,1.01-2.09l0.02-0.02 c0.62-0.54,1.41-0.77,2.18-0.72c0.77,0.05,1.53,0.4,2.09,1.02c5.86,6.72,10.24,13.74,13.19,20.92c3.04,7.39,4.57,14.95,4.64,22.48 c0.07,7.63-1.37,15.21-4.24,22.55c-2.87,7.3-7.16,14.36-12.83,20.97L105.78,87.97L105.78,87.97z M92.11,75.32 c-0.56,0.62-1.32,0.97-2.1,1.01c-0.77,0.05-1.57-0.21-2.19-0.76c-0.62-0.56-0.97-1.32-1.01-2.1c-0.05-0.77,0.2-1.57,0.76-2.19 l0.01-0.01c3.88-4.38,6.8-8.86,8.73-13.37c1.92-4.5,2.86-9.04,2.79-13.58c-0.07-4.46-1.13-8.96-3.23-13.43 c-2.06-4.41-5.13-8.81-9.23-13.15l-0.02-0.03c-0.57-0.6-0.83-1.37-0.8-2.13c0.03-0.77,0.35-1.54,0.94-2.11l0.04-0.04 c0.6-0.57,1.37-0.83,2.13-0.81c0.77,0.02,1.54,0.35,2.12,0.94l0.01,0.01c4.62,4.9,8.07,9.91,10.4,14.98l0.01,0.03 c2.38,5.17,3.59,10.41,3.68,15.65c0.09,5.31-0.98,10.59-3.16,15.78c-2.17,5.15-5.45,10.22-9.79,15.13 C92.19,75.2,92.16,75.26,92.11,75.32L92.11,75.32z M35.34,71.32c0.55,0.62,0.8,1.41,0.75,2.17c-0.05,0.77-0.39,1.54-1.01,2.1 c-0.62,0.56-1.41,0.81-2.18,0.77c-0.77-0.05-1.54-0.39-2.1-1.01c-4.39-4.97-7.71-10.09-9.91-15.3c-2.18-5.18-3.26-10.45-3.17-15.75 c0.09-5.24,1.31-10.49,3.69-15.68l0.01-0.03c2.33-5.06,5.78-10.07,10.38-14.95l0.03-0.03c0.58-0.59,1.35-0.9,2.12-0.93 c0.77-0.02,1.55,0.25,2.15,0.83c0.61,0.58,0.93,1.36,0.95,2.13c0.02,0.77-0.25,1.55-0.83,2.15c-4.09,4.36-7.16,8.77-9.23,13.18 c-2.09,4.47-3.16,8.96-3.24,13.4c-0.07,4.53,0.88,9.07,2.8,13.55c1.91,4.48,4.8,8.92,8.6,13.25c0.06,0.02,0.12,0.05,0.16,0.1 L35.34,71.32L35.34,71.32z M21.69,84l0.03,0.03c0.53,0.64,0.76,1.43,0.71,2.2c-0.06,0.77-0.41,1.51-1.04,2.05l-0.05,0.04 c-0.64,0.53-1.43,0.76-2.2,0.7c-0.77-0.06-1.52-0.42-2.06-1.06c-5.67-6.62-9.97-13.68-12.83-20.98C1.37,59.65-0.07,52.07,0,44.44 c0.08-7.54,1.6-15.1,4.64-22.49C7.6,14.77,11.97,7.74,17.83,1.04c0.54-0.62,1.29-0.97,2.07-1.02c0.77-0.05,1.57,0.19,2.21,0.73 l0.01,0.01c0.62,0.54,0.97,1.29,1.02,2.07c0.05,0.77-0.19,1.57-0.73,2.21l-0.01,0.01C17.03,11.19,13,17.61,10.3,24.15 c-2.77,6.71-4.17,13.54-4.22,20.33c-0.05,6.89,1.26,13.75,3.88,20.41C12.58,71.52,16.51,77.94,21.69,84L21.69,84z M69.74,45.96 c1.19-0.77,1.18-1.62,0-2.3L57.47,36.6c-0.97-0.61-1.98-0.25-1.95,1.01l0.04,14.26c0.08,1.37,0.87,1.75,2.02,1.11L69.74,45.96 L69.74,45.96L69.74,45.96z M61.44,25.92c10.27,0,18.59,8.32,18.59,18.59c0,10.27-8.32,18.59-18.59,18.59 c-10.27,0-18.59-8.32-18.59-18.59C42.85,34.24,51.17,25.92,61.44,25.92L61.44,25.92L61.44,25.92z" />
  </Icon>
);
